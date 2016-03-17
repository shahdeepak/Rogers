/**
 * Controller  for the  closed caption editor page
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 */
rbi.controller('captionEditorCtrl',
    function ($scope, $location, $routeParams, $dialog, rbiCommonService, loginService) {

        $scope.eventHandler = new CaptionEditorEventHandler($scope, $location);
        sharedScopeWithMenu($scope, $location);
        $scope.CurrentTabName = 'CAPTION_EDITOR';
        $scope.selectedTab = 3;
        $scope.levelMap = {};

        $scope.levelMap["2"] = {
            CurrentIndex: 3,
            MaxElements: 4,
            CanHandleDnKey: false,
            CanHandleUpKey: false,
            FirstElement: 0
        };

        // Initialize panes
        $scope.panes = accountHelper.panes;

        var DROP_DOWN_LIST_ITEM_HEIGHT = 50;  // Note: corresponds to line-height of drop-down-list-expanded-item in CSS
        var DROP_DOWN_COLLAPSED_HEIGHT = 80;  // height of caption-setting-wrapper
        var DROP_DOWN_OFFSET_DEFAULT = 5;     // top coordinate of drp-dwn-ctnr-expanded
        var CAPTION_SETTINGS_CONTAINER_HEIGHT = 400;  // height of caption container
        var DROP_DOWN_LIST_MARGIN = 8;
        var NUM_DROPDOWN_LISTS = 4;

        // Set default focus on the page
        $scope.CurrentLevelIndex = 3;
        $scope.focusIndex = 0;
        helper.SetFocus('reset-defaults-button');
        $scope.dropDownListId = 0;
        $scope.dropDownListIdTop = 0;
        $scope.dropDownListIdBottom = NUM_DROPDOWN_LISTS-1;

        $scope.captionProperties = {
            textFont: CAPTION_FONT_DEFAULT,
            textSize: CAPTION_TEXT_SIZE_DEFAULT,
            textColor: CAPTION_TEXT_COLOR_DEFAULT, // white
            textOpacity: CAPTION_TEXT_OPACITY_DEFAULT,
            backgroundColor: CAPTION_BACKGROUND_COLOR_DEFAULT,  // none
            backgroundOpacity: CAPTION_BACKGROUND_OPACITY_DEFAULT,
            windowColor: CAPTION_WINDOW_COLOR_DEFAULT,
            windowOpacity: CAPTION_WINDOW_OPACITY_DEFAULT,
            edgeStyle: CAPTION_EDGE_STYLE_DEFAULT
        };

        $scope.textFontOptions = [
            {
                description: 'Default',
                selected: true,
                value: CAPTION_FONT_DEFAULT
            },
            {
                description: 'Monospaced Serif', // consolas, courier
                selected: false,
                value: CAPTION_FONT_MONO_SERIF
            },
            {
                description: 'Standard Serif', // TIMES NEW ROMAN
                selected: false,
                value: CAPTION_FONT_SERIF
            },
            {
                description: 'Monospaced San-Serif', // Elron mono
                selected: false,
                value: CAPTION_FONT_MONO_SANSERIF
            },
            {
                description: 'Standard San-Serif', // Arial-Helvetica
                selected: false,
                value: CAPTION_FONT_SANSERIF
            },
            {
                description: 'Casual',
                selected: false,
                value: CAPTION_FONT_CASUAL
            },
            {
                description: 'Cursive',
                selected: false,
                value: CAPTION_FONT_CURSIVE
            },
            {
                description: 'Small Caps',
                selected: false,
                value: CAPTION_FONT_SMALLCAPS
            }
        ];

        $scope.textSizeOptions = [
            {
                description: 'Default (100%)',
                selected: true,
                value: 25
            },
            {
                description: 'Small (50%)',
                selected: false,
                value: 18
            },
            {
                description: 'Large (150%)',
                selected: false,
                value: 32
            },
            {
                description: 'X-Large (200%)',
                selected: false,
                value: 40
            }
        ];

        $scope.textColorOptions = [
            {
                description: 'White (Default)',
                selected: true,
                value: '#ffffff'
            },
            {
                description: 'Black',
                selected: false,
                value: '#000000'
            },
            {
                description: 'Red',
                selected: false,
                value: '#ff0000'
            },
            {
                description: 'Green',
                selected: false,
                value: '#00ff00'
            },
            {
                description: 'Blue',
                selected: false,
                value: '#0000ff'
            },
            {
                description: 'Yellow',
                selected: false,
                value: '#ffff00'
            },
            {
                description: 'Magenta',
                selected: false,
                value: '#ff00ff'
            },
            {
                description: 'Cyan',
                selected: false,
                value: '#00ffff'
            }
        ];

        $scope.bgColorOptions = [
            /*{
                description: 'None (default)',
                selected: true,
                value: 'transparent'
            },*/
            {
                description: 'Black (Default)',
                selected: false,
                value: '#000000'
            },
            {
                description: 'White',
                selected: false,
                value: '#ffffff'
            },
            {
                description: 'Red',
                selected: false,
                value: '#ff0000'
            },
            {
                description: 'Green',
                selected: false,
                value: '#00ff00'
            },
            {
                description: 'Blue',
                selected: false,
                value: '#0000ff'
            },
            {
                description: 'Yellow',
                selected: false,
                value: '#ffff00'
            },
            {
                description: 'Magenta',
                selected: false,
                value: '#ff00ff'
            },
            {
                description: 'Cyan',
                selected: false,
                value: '#00ffff'
            }
        ];

        $scope.bgOpacityOptions = [
            {
                description: '100% Transparent (Default)',
                selected: true,
                value: 0.0
            },
            {
                description: '75% Transparent',
                selected: false,
                value: 0.25
            },
            {
                description: '50% Transparent',
                selected: false,
                value: 0.5
            },
            {
                description: '25% Transparent',
                selected: false,
                value: 0.75
            },
            {
                description: 'Opaque',
                selected: false,
                value: 1.0
            }

        ];

        $scope.windowColorOptions = [
            /*{
             description: 'None (default)',
             selected: true,
             value: 'transparent'
             },*/
            {
                description: 'Black (Default)',
                selected: false,
                value: '#000000'
            },
            {
                description: 'White',
                selected: false,
                value: '#ffffff'
            },
            {
                description: 'Red',
                selected: false,
                value: '#ff0000'
            },
            {
                description: 'Green',
                selected: false,
                value: '#00ff00'
            },
            {
                description: 'Blue',
                selected: false,
                value: '#0000ff'
            },
            {
                description: 'Yellow',
                selected: false,
                value: '#ffff00'
            },
            {
                description: 'Magenta',
                selected: false,
                value: '#ff00ff'
            },
            {
                description: 'Cyan',
                selected: false,
                value: '#00ffff'
            }
        ];

        $scope.windowOpacityOptions = [
            {
                description: '100% Transparent (Default)',
                selected: true,
                value: 0.0
            },
            {
                description: '75% Transparent',
                selected: false,
                value: 0.25
            },
            {
                description: '50% Transparent',
                selected: false,
                value: 0.5
            },
            {
                description: '25% Transparent',
                selected: false,
                value: 0.75
            },
            {
                description: 'Opaque',
                selected: false,
                value: 1.0
            }

        ];

        $scope.textOpacityOptions = [
            {
                description: '100% Opacity (Default)',
                selected: true,
                value: 1.0
            },
            {
                description: '75% Opacity',
                selected: false,
                value: 0.75
            },
            {
                description: '50% Opacity',
                selected: false,
                value: 0.5
            },
            {
                description: '25% Opacity',
                selected: false,
                value: 0.25
            },
            {
                description: '0% Opacity (Transparent)',
                selected: false,
                value: 0.0
            }

        ];

        $scope.textEdgeStyleOptions = [
            {
                description: 'Default',
                selected: true,
                value: TEXT_EDGE_DEFAULT
            },
            {
                description: 'No edge attribute',
                selected: true,
                value: TEXT_EDGE_NONE
            },
            {
                description: 'Raised edges',
                selected: false,
                value: TEXT_EDGE_RAISED
            },
            {
                description: 'Depressed edges',
                selected: false,
                value: TEXT_EDGE_DEPRESSED
            },
            {
                description: 'Uniform edges',
                selected: false,
                value: TEXT_EDGE_UNIFORM
            },
            {
                description: 'Drop shadow edges',
                selected: false,
                value: TEXT_EDGE_DROP_SHADOW
            }
        ];

        $scope.setTextFont = function (item) {
            var dropDownList = $scope.dropDownOptionsList[0];
            $scope.captionProperties.textFont = item.value;
            dropDownList.focusIndex =  getSelectedItem($scope.textFontOptions, $scope.captionProperties.textFont);
            dropDownList.selectedItem = dropDownList.options[dropDownList.focusIndex];
            collapseDropDownLists();
            platformStorage.setItem(CAPTION_TEXT_FONT, $scope.captionProperties.textFont);
            $("#caption-text").css('font-family', String($scope.captionProperties.textFont));
            if (!$scope.$$phase) $scope.$apply();
        };

        $scope.setTextSize = function (item) {
            var dropDownList = $scope.dropDownOptionsList[2];
            $scope.captionProperties.textSize = item.value;
            dropDownList.focusIndex =  getSelectedItem($scope.textSizeOptions, $scope.captionProperties.textSize);
            dropDownList.selectedItem = dropDownList.options[dropDownList.focusIndex];
            collapseDropDownLists();
            platformStorage.setItem(CAPTION_TEXT_SIZE, $scope.captionProperties.textSize);
            $("#caption-text").css('font-size', $scope.captionProperties.textSize+'px');
            if (!$scope.$$phase) $scope.$apply();
        };

        $scope.setTextColor = function (item) {
            var dropDownList = $scope.dropDownOptionsList[1];
            $scope.captionProperties.textColor = item.value;
            dropDownList.focusIndex = getSelectedItem($scope.textColorOptions, $scope.captionProperties.textColor);
            dropDownList.selectedItem = dropDownList.options[dropDownList.focusIndex];
            collapseDropDownLists();
            platformStorage.setItem(CAPTION_TEXT_COLOR, $scope.captionProperties.textColor);
            $("#caption-text").css('color', $scope.captionProperties.textColor);
            if (!$scope.$$phase) $scope.$apply();
        };

        $scope.setEdgeStyle = function (item) {
            var dropDownList = $scope.dropDownOptionsList[3];
            $scope.captionProperties.edgeStyle = item.value;
            dropDownList.focusIndex = getSelectedItem($scope.textEdgeStyleOptions, $scope.captionProperties.edgeStyle);
            dropDownList.selectedItem = dropDownList.options[dropDownList.focusIndex];
            collapseDropDownLists();
            platformStorage.setItem(CAPTION_EDGE_STYLE, $scope.captionProperties.edgeStyle);
            $("#caption-text").css('text-shadow', $scope.captionProperties.edgeStyle);
        };

        $scope.setTextOpacity = function (item) {
            var dropDownList = $scope.dropDownOptionsList[4];
            $scope.captionProperties.textOpacity = item.value;
            dropDownList.focusIndex = getSelectedItem($scope.textOpacityOptions, $scope.captionProperties.textOpacity);
            dropDownList.selectedItem = dropDownList.options[dropDownList.focusIndex];
            collapseDropDownLists();
            platformStorage.setItem(CAPTION_TEXT_OPACITY, $scope.captionProperties.textOpacity);
            $("#caption-text").css('opacity', $scope.captionProperties.textOpacity);
            if (!$scope.$$phase) $scope.$apply();
        };


        $scope.setBackgroundColor = function (item) {
            var dropDownList = $scope.dropDownOptionsList[5];
            $scope.captionProperties.backgroundColor = item.value;
            dropDownList.focusIndex = getSelectedItem($scope.bgColorOptions, $scope.captionProperties.backgroundColor);
            dropDownList.selectedItem = dropDownList.options[dropDownList.focusIndex];
            collapseDropDownLists();
            platformStorage.setItem(CAPTION_BACKGROUND_COLOR, $scope.captionProperties.backgroundColor);
            //accountHelper.setBackgroundColor("#caption-text", $scope.captionProperties.backgroundColor, $scope.captionProperties.backgroundOpacity);
           if ($scope.captionProperties.backgroundOpacity == 0.0) {
                $("#caption-text").css('background-color', 'transparent');
            }
            else {
                accountHelper.setBackgroundColor("#caption-text", $scope.captionProperties.backgroundColor, $scope.captionProperties.backgroundOpacity);
            }
            if (!$scope.$$phase) $scope.$apply();
        };

        $scope.setBackgroundOpacity = function (item) {
            var dropDownList = $scope.dropDownOptionsList[6];
            $scope.captionProperties.backgroundOpacity = item.value;
            dropDownList.focusIndex = getSelectedItem($scope.bgOpacityOptions, $scope.captionProperties.backgroundOpacity);
            dropDownList.selectedItem = dropDownList.options[dropDownList.focusIndex];
            collapseDropDownLists();
            platformStorage.setItem(CAPTION_BACKGROUND_OPACITY, $scope.captionProperties.backgroundOpacity);
            accountHelper.setBackgroundColor("#caption-text", $scope.captionProperties.backgroundColor, $scope.captionProperties.backgroundOpacity);
            if (!$scope.$$phase) $scope.$apply();
        };

        $scope.setWindowColor = function (item) {
            var dropDownList = $scope.dropDownOptionsList[7];
            $scope.captionProperties.windowColor = item.value;
            dropDownList.focusIndex = getSelectedItem($scope.windowColorOptions, $scope.captionProperties.windowColor);
            dropDownList.selectedItem = dropDownList.options[dropDownList.focusIndex];
            collapseDropDownLists();
            platformStorage.setItem(CAPTION_WINDOW_COLOR, $scope.captionProperties.windowColor);
            //accountHelper.setBackgroundColor("#caption-window", $scope.captionProperties.windowColor, $scope.captionProperties.windowOpacity);

            if ($scope.captionProperties.windowOpacity == 0.0) {
                $("#caption-window").css('background-color', 'transparent');
            }
            else {
                accountHelper.setBackgroundColor("#caption-window", $scope.captionProperties.windowColor, $scope.captionProperties.windowOpacity);
            }
            if (!$scope.$$phase) $scope.$apply();
        };

        $scope.setWindowOpacity = function (item) {
            var dropDownList = $scope.dropDownOptionsList[8];
            $scope.captionProperties.windowOpacity = item.value;
            dropDownList.focusIndex = getSelectedItem($scope.windowOpacityOptions, $scope.captionProperties.windowOpacity);
            dropDownList.selectedItem = dropDownList.options[dropDownList.focusIndex];
            collapseDropDownLists();
            platformStorage.setItem(CAPTION_WINDOW_OPACITY, $scope.captionProperties.windowOpacity);
            accountHelper.setBackgroundColor("#caption-window", $scope.captionProperties.windowColor, $scope.captionProperties.windowOpacity);
            if (!$scope.$$phase) $scope.$apply()
        };



        $scope.dropDownOptionsList = [
            {
                title: 'Text Font',
                isOpen: false,
                setProperty: $scope.setTextFont,
                options: $scope.textFontOptions,
                selectedItem: $scope.textFontOptions[0],
                hasFocus: false,
                focusIndex: 0,
                isDisplayed: true,
                showPreviewColor: false
            },
            {
                title: 'Text Color',
                isOpen: false,
                setProperty: $scope.setTextColor,
                options: $scope.textColorOptions,
                selectedItem: $scope.textColorOptions[0],
                hasFocus: false,
                focusIndex: 0,
                isDisplayed: true,
                showPreviewColor: true
            },
            {
                title: 'Text Size',
                isOpen: false,
                setProperty: $scope.setTextSize,
                options: $scope.textSizeOptions,
                selectedItem: $scope.textSizeOptions[0],
                hasFocus: false,
                focusIndex: 0,
                isDisplayed: true,
                showPreviewColor: false
            },
            {
                title: 'Text Edge Style',
                isOpen: false,
                setProperty: $scope.setEdgeStyle,
                options: $scope.textEdgeStyleOptions,
                selectedItem: $scope.textEdgeStyleOptions[0],
                hasFocus: false,
                focusIndex: 0,
                isDisplayed: true,
                showPreviewColor: false
            },
            {
                title: 'Text Opacity',
                isOpen: false,
                setProperty: $scope.setTextOpacity,
                options: $scope.textOpacityOptions,
                selectedItem: $scope.textOpacityOptions[0],
                hasFocus: false,
                focusIndex: 0,
                isDisplayed: false,
                showPreviewColor: false
            },
            {
                title: 'Background Color',
                isOpen: false,
                setProperty: $scope.setBackgroundColor,
                options: $scope.bgColorOptions,
                selectedItem: $scope.bgColorOptions[0],
                hasFocus: false,
                focusIndex: 0,
                isDisplayed: false,
                showPreviewColor: true
            },
            {
                title: 'Background Opacity',
                isOpen: false,
                setProperty: $scope.setBackgroundOpacity,
                options: $scope.bgOpacityOptions,
                selectedItem: $scope.bgOpacityOptions[0],
                hasFocus: false,
                focusIndex: 0,
                isDisplayed: false,
                showPreviewColor: false
            },
            {
                title: 'Window Color',
                isOpen: false,
                setProperty: $scope.setWindowColor,
                options: $scope.windowColorOptions,
                selectedItem: $scope.windowColorOptions[0],
                hasFocus: false,
                focusIndex: 0,
                isDisplayed: false,
                showPreviewColor: true
            },
            {
                title: 'Window Opacity',
                isOpen: false,
                setProperty: $scope.setWindowOpacity,
                options: $scope.windowOpacityOptions,
                selectedItem: $scope.windowOpacityOptions[0],
                hasFocus: false,
                focusIndex: 0,
                isDisplayed: false,
                showPreviewColor: false
            }
        ];

        accountHelper.getCaptionAttributes($scope.captionProperties);
        setCaptionAttributes();

        // Reset defaults
        $scope.resetDefaults = function () {
            $scope.captionProperties.textFont = CAPTION_FONT_DEFAULT;
            $scope.captionProperties.textSize = CAPTION_TEXT_SIZE_DEFAULT;
            $scope.captionProperties.textColor = CAPTION_TEXT_COLOR_DEFAULT;
            $scope.captionProperties.textOpacity = CAPTION_TEXT_OPACITY_DEFAULT;
            $scope.captionProperties.backgroundColor = CAPTION_BACKGROUND_COLOR_DEFAULT;
            $scope.captionProperties.backgroundOpacity = CAPTION_BACKGROUND_OPACITY_DEFAULT;
            $scope.captionProperties.windowColor = CAPTION_WINDOW_COLOR_DEFAULT;      // black
            $scope.captionProperties.windowOpacity = CAPTION_WINDOW_OPACITY_DEFAULT;
            $scope.captionProperties.edgeStyle = CAPTION_EDGE_STYLE_DEFAULT;
            platformStorage.setItem(CAPTION_TEXT_FONT, $scope.captionProperties.textFont);
            platformStorage.setItem(CAPTION_TEXT_SIZE, $scope.captionProperties.textSize);
            platformStorage.setItem(CAPTION_TEXT_COLOR, $scope.captionProperties.textColor);
            platformStorage.setItem(CAPTION_TEXT_OPACITY, $scope.captionProperties.textOpacity);
            platformStorage.setItem(CAPTION_BACKGROUND_COLOR, $scope.captionProperties.backgroundColor);
            platformStorage.setItem(CAPTION_BACKGROUND_OPACITY, $scope.captionProperties.backgroundOpacity);
            platformStorage.setItem(CAPTION_WINDOW_COLOR, $scope.captionProperties.windowColor);
            platformStorage.setItem(CAPTION_WINDOW_OPACITY, $scope.captionProperties.windowOpacity);
            platformStorage.setItem(CAPTION_EDGE_STYLE, $scope.captionProperties.edgeStyle);
            setCaptionAttributes();
            if (!$scope.$$phase) $scope.$apply();
        };


        $scope.expandDropDownList = function(item) {
            $scope.dropDownListId = $scope.focusIndex - 1;
            for (var i=0; i<$scope.dropDownOptionsList.length; i++) {
                $scope.dropDownOptionsList[i].isOpen = ($scope.dropDownOptionsList[i].title == item.title)? true:false;
            }
            $scope.focusIndex = item.focusIndex;
            $scope.CurrentLevelIndex = 4;
            adjustDropdownListPosition();
            if (!$scope.$$phase) $scope.$apply();
        }

        function adjustDropdownListPosition() {
            var listOffset = ($scope.dropDownListId - $scope.dropDownListIdTop)*DROP_DOWN_COLLAPSED_HEIGHT;
            var listHeight = $scope.dropDownOptionsList[$scope.dropDownListId].options.length*DROP_DOWN_LIST_ITEM_HEIGHT;
            var elementId = '#list-expanded_' + $scope.dropDownListId;
            var listBottomPos = listOffset + listHeight + DROP_DOWN_OFFSET_DEFAULT + DROP_DOWN_LIST_MARGIN;
            if ( listBottomPos >= CAPTION_SETTINGS_CONTAINER_HEIGHT) {
                var topOffset = CAPTION_SETTINGS_CONTAINER_HEIGHT - listBottomPos - DROP_DOWN_OFFSET_DEFAULT;
                $(elementId).css('top', topOffset);
            }
            else {
                $(elementId).css('top', DROP_DOWN_OFFSET_DEFAULT);
            }
        }

        function collapseDropDownLists() {
            for (var i=0; i<$scope.dropDownOptionsList.length; i++) {
                $scope.dropDownOptionsList[i].isOpen = false;
            }
        }

        function getSelectedItem(optionType, captionProperty) {
            var selectedItem = 0;
            for (var i=0; i< optionType.length; i++) {
                optionType[i].selected = (optionType[i].value == captionProperty)? true:false;
                if (optionType[i].selected) {
                    selectedItem = i;
                }
            }
            return selectedItem;
        }

        function setCaptionAttributes() {
            $scope.dropDownOptionsList[0].focusIndex = getSelectedItem($scope.textFontOptions, $scope.captionProperties.textFont);
            $scope.dropDownOptionsList[1].focusIndex = getSelectedItem($scope.textColorOptions, $scope.captionProperties.textColor);
            $scope.dropDownOptionsList[2].focusIndex = getSelectedItem($scope.textSizeOptions, $scope.captionProperties.textSize);
            $scope.dropDownOptionsList[3].focusIndex = getSelectedItem($scope.textEdgeStyleOptions, $scope.captionProperties.edgeStyle);
            $scope.dropDownOptionsList[4].focusIndex = getSelectedItem($scope.textOpacityOptions, $scope.captionProperties.textOpacity);
            $scope.dropDownOptionsList[5].focusIndex = getSelectedItem($scope.bgColorOptions, $scope.captionProperties.backgroundColor);
            $scope.dropDownOptionsList[6].focusIndex = getSelectedItem($scope.bgOpacityOptions, $scope.captionProperties.backgroundOpacity);
            $scope.dropDownOptionsList[7].focusIndex = getSelectedItem($scope.windowColorOptions, $scope.captionProperties.windowColor);
            $scope.dropDownOptionsList[8].focusIndex = getSelectedItem($scope.windowOpacityOptions, $scope.captionProperties.windowOpacity);
            for (var i=0; i<$scope.dropDownOptionsList.length; i++) {
                $scope.dropDownOptionsList[i].selectedItem = $scope.dropDownOptionsList[i].options[$scope.dropDownOptionsList[i].focusIndex];
            }
            accountHelper.applyCaptionAttributes("#caption-window", '#caption-text', $scope.captionProperties);
        }

        // Tab click
        $scope.onTabClick = function (tabId) {
            var newPath = accountHelper.onTabClick($scope, tabId)
            $location.path(newPath);
        };

        // Logout
        function logoutCallback() {
            $location.path('/login/account');
            refreshMainMenu(backPaths[backPaths.length - 1]);
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        $scope.logoutUser = function () {
            accountHelper.processLogoutUser(loginService, rbiCommonService, logoutCallback);
        }
    });
