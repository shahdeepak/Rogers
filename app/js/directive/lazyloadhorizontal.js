/**
 * Created with JetBrains WebStorm.
 * User: Vineet-PC
 * Date: 29/9/13
 * Time: 2:00 AM
 * To change this template use File | Settings | File Templates.
 */
rbi.directive(
    "horizontalLazySrc",
    function( $window, $document ) {

        var lazyLoader = (function() {

            // I maintain a list of images that lazy-loading
            // and have yet to be rendered.
            var images = [];

            // I define the render timer for the lazy loading
            // images to that the DOM-querying (for offsets)
            // is chunked in groups.
            var renderTimer = null;
            var renderDelay = 500;

            // I cache the window element as a jQuery reference.
            var win = $( $window );

            // I cache the document document width so that
            // we can respond to changes in the width due to
            // dynamic content.
            //var doc = $document;
            var doc = $("#topgrid");
            var documentWidth = doc.width();
            var documentTimer = null;
            var documentDelay = 500;

            // I determine if the window dimension events
            // (ie. resize, scroll) are currently being
            // monitored for changes.
            var isWatchingWindow = false;


            // ---
            // PUBLIC METHODS.
            // ---


            // I start monitoring the given image for visibility
            // and then render it when necessary.
            function addImage( image ) {

                images.push( image );

                if ( ! renderTimer ) {

                    startRenderTimer();

                }

                if ( ! isWatchingWindow ) {

                    startWatchingWindow();

                }

            }


            // I remove the given image from the render queue.
            function removeImage( image ) {

                // Remove the given image from the render queue.
                for ( var i = 0 ; i < images.length ; i++ ) {

                    if ( images[ i ] === image ) {

                        images.splice( i, 1 );
                        break;

                    }

                }

                // If removing the given image has cleared the
                // render queue, then we can stop monitoring
                // the window and the image queue.
                if ( ! images.length ) {

                    clearRenderTimer();

                    stopWatchingWindow();

                }

            }


            // ---
            // PRIVATE METHODS.
            // ---


            // I check the document height to see if it's changed.
            function checkDocumentWidth() {

                // If the render time is currently active, then
                // don't bother getting the document width -
                // it won't actually do anything.
                if ( renderTimer ) {

                    return;

                }

                var currentDocumentWidth = doc.width();

                // If the width has not changed, then ignore -
                // no more images could have come into view.
                if ( currentDocumentWidth === documentWidth ) {

                    return;

                }

                // Cache the new document width.
                documentWidth = currentDocumentWidth;

                startRenderTimer();

            }


            // I check the lazy-load images that have yet to
            // be rendered.
            function checkImages() {

                // Log here so we can see how often this
                // gets called during page activity.
                console.log( "Checking for visible images..." );

                var visible = [];
                var hidden = [];

                // Determine the window dimensions.
                var windowWidth = win.width();
                var scrollLeft = win.scrollLeft();

                //var windowWidth = $(".photos").width();
                //var scrollLeft = $(".photos").scrollLeft();

                // Calculate the viewport offsets.
                var leftFoldOffset = scrollLeft;
                var rightFoldOffset = ( leftFoldOffset + windowWidth );

                // Query the DOM for layout and separate the
                // images into two different categories: those
                // that are now in the viewport and those that
                // still remain hidden.
                for ( var i = 0 ; i < images.length ; i++ ) {

                    var image = images[ i ];

                    if ( image.isVisible( leftFoldOffset, rightFoldOffset ) ) {

                        visible.push( image );

                    } else {

                        hidden.push( image );

                    }

                }

                // Update the DOM with new image source values.
                for ( var i = 0 ; i < visible.length ; i++ ) {

                    visible[ i ].render();

                }

                // Keep the still-hidden images as the new
                // image queue to be monitored.
                images = hidden;

                // Clear the render timer so that it can be set
                // again in response to window changes.
                clearRenderTimer();

                // If we've rendered all the images, then stop
                // monitoring the window for changes.
                if ( ! images.length ) {

                    stopWatchingWindow();

                }

            }


            // I clear the render timer so that we can easily
            // check to see if the timer is running.
            function clearRenderTimer() {

                clearTimeout( renderTimer );

                renderTimer = null;

            }


            // I start the render time, allowing more images to
            // be added to the images queue before the render
            // action is executed.
            function startRenderTimer() {

                renderTimer = setTimeout( checkImages, renderDelay );

            }


            // I start watching the window for changes in dimension.
            function startWatchingWindow() {

                isWatchingWindow = true;

                // Listen for window changes.
                $("#topgrid").on( "resize.horizontalLazySrc", windowChanged );
                $("#topgrid").on( "scroll.horizontalLazySrc", windowChanged );
                //win.on( "resize.horizontalLazySrc", windowChanged );
                //win.on( "scroll.horizontalLazySrc", windowChanged );

                // Set up a timer to watch for document-height changes.
                documentTimer = setInterval( checkDocumentWidth, documentDelay );

            }


            // I stop watching the window for changes in dimension.
            function stopWatchingWindow() {

                isWatchingWindow = false;

                // Stop watching for window changes.
                $("#topgrid").off( "resize.horizontalLazySrc" );
                $("#topgrid").off( "scroll.horizontalLazySrc" );
                //win.off( "resize.horizontalLazySrc" );
                //win.off( "scroll.horizontalLazySrc" );

                // Stop watching for document changes.
                clearInterval( documentTimer );

            }


            // I start the render time if the window changes.
            function windowChanged() {

                if ( ! renderTimer ) {

                    startRenderTimer();

                }

            }


            // Return the public API.
            return({
                addImage: addImage,
                removeImage: removeImage
            });

        })();


        // ------------------------------------------ //
        // ------------------------------------------ //


        // I represent a single lazy-load image.
        function LazyImage( element ) {

            // I am the interpolated LAZY SRC attribute of
            // the image as reported by AngularJS.
            var source = null;

            // I determine if the image has already been
            // rendered (ie, that it has been exposed to the
            // viewport and the source had been loaded).
            var isRendered = false;

            // I am the cached width of the element. We are
            // going to assume that the image doesn't change
            // width over time.
            var width = null;


            // ---
            // PUBLIC METHODS.
            // ---


            // I determine if the element is above the given
            // fold of the page.
            function isVisible( leftFoldOffset, rightFoldOffset ) {

                // If the element is not visible because it
                // is hidden, don't bother testing it.
                if ( ! element.is( ":visible" ) ) {

                    return( false );

                }

                // If the width has not yet been calculated,
                // the cache it for the duration of the page.
                if ( width === null ) {

                    width = element.width();

                }

                // Update the dimensions of the element.
                var left = element.offset().left;
                var right = ( left + width );

                // Return true if the element is:
                // 1. The left offset is in view.
                // 2. The right offset is in view.
                // 3. The element is overlapping the viewport.
                return(
                    (
                        ( left <= rightFoldOffset ) &&
                            ( left >= leftFoldOffset )
                        )
                        ||
                        (
                            ( right <= rightFoldOffset ) &&
                                ( right >= leftFoldOffset )
                            )
                        ||
                        (
                            ( left <= leftFoldOffset ) &&
                                ( right >= rightFoldOffset )
                            )
                    );

            }


            // I move the cached source into the live source.
            function render() {

                isRendered = true;

                renderSource();

            }


            // I set the interpolated source value reported
            // by the directive / AngularJS.
            function setSource( newSource ) {

                source = newSource;

                if ( isRendered ) {

                    renderSource();

                }

            }


            // ---
            // PRIVATE METHODS.
            // ---


            // I load the lazy source value into the actual
            // source value of the image element.
            function renderSource() {

                element[ 0 ].src = source;

            }


            // Return the public API.
            return({
                isVisible: isVisible,
                render: render,
                setSource: setSource
            });

        }


        // ------------------------------------------ //
        // ------------------------------------------ //


        // I bind the UI events to the scope.
        function link( $scope, element, attributes ) {

            var lazyImage = new LazyImage( element );

            // Start watching the image for changes in its
            // visibility.
            lazyLoader.addImage( lazyImage );


            // Since the lazy-src will likely need some sort
            // of string interpolation, we don't want to
            attributes.$observe(
                "horizontalLazySrc",
                function( newSource ) {

                    lazyImage.setSource( newSource );

                }
            );


            // When the scope is destroyed, we need to remove
            // the image from the render queue.
            $scope.$on(
                "$destroy",
                function() {

                    lazyLoader.removeImage( lazyImage );

                }
            );

        }


        // Return the directive configuration.
        return({
            link: link,
            restrict: "A"
        });

    }
);

