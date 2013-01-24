/**
 * Custom Select jQuery Plugin
 * @author Amir Harel
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 *
 */
(function($){
    $.fn.customSelect = function(o){
        var select = this.get(0);
        if( select && !select._customSelect ){
            select._customSelect = new CustomSelect(select,o);
        }
        else if( select && typeof o === "string" && o.indexOf("get") === 0 ){
            return select._customSelect[o]();
        }
        return this;
    };


    var TEMPLATES = {
        BOUNDING_BOX : '<div class="jcs-main"><div class="jcs-main-box"></div><button class="jcs-main-button"><span class="jcs-select-arrow"></span></button><ul class="jcs-option-list" style="display:none;"></ul></div>'
    };

    /**
     * @class CustomSelect
     * @param select {DOMElement} the dom element to be the base for the custom select
     * @param o {Object|String} if object, this is the configuration for the initialization
     *  if this is a string it is the name of the method we need to execture. for now we
     *  support only get methods.
     */
    function CustomSelect(select,o){
        this._select = select;
        o.context = o.context || this;
        this._cfg = o;
        this._render();
        this._bind();
    }

    CustomSelect.prototype = {
        /**
         * This is the base element for the custome element. This could be either an actual
         * SELECT element or any other dom element that will be used as a container to the
         * custom select.
         * @attribute _select
         * @private
         * @type {DOMElement}
         */
        _select : null,

        /**
         * configuration object
         * @attribute _cfg
         * @private
         * @type {Object}
         */
        _cfg : null,

        /**
         * the custom select create its own dom structure to control
         * the pseudo select element. this is the reference to the bounding box
         * @attribute _$boundingBox
         * @private
         * @type {jQuery}
         */
        _$boundingBox : null,

        /**
         * reference to the LI element which is now selected in the custom select.
         * @attribute _$selectedElm
         * @private
         * @type {jQuery}
         */
        _$selectedElm : null,

        /**
         * binding to all relevant event
         * @method _bind
         * @private
         */
        _bind: function(){
            var that = this;
            this._$boundingBox.find(".jcs-main-button").on("click",function(){that._showDropdown();});
            this._$boundingBox.find(".jcs-main-box").on("click",function(){that._showDropdown();});
            this._$boundingBox.find(".jcs-option-list li").on("click",function(e){that._onItemClicked(e);});
            $(window).click(function(e){
                if( $(e.target).hasClass("jcs-main") || $(e.target).parents(".jcs-main").size() ){
                    return;
                }
                that._hideDropdown();
            });
        },

        /**
         * getting the selected option in the select. since this is pseudo select
         * there is no real OPTION element so we provide 3 major attribute to access
         * options: str - the option html, attr - dictionary object for all the option
         * element dom attributes.
         * @method getSelected
         * @return {Object}
         * <pre>
         *  index {Number} the selected option index
         *  str {String} the html of the selected option
         *  attr {Object} dictionary where keys are the attribute names and values are the
         *      attributes value
         * </pre>
         */
        getSelected: function(){
            var selected = this._getDataFromElm(this._$selectedElm);
            return selected;
        },

        /**
         * getting the selectd option index in the select.
         * @method getSelectedIndex
         * @return {Number} 0-index number
         */
        getSelectedIndex: function(){
            return this.getSelected().index;
        },

        /**
         * extract the html, index and attriburtes from a given element.
         * @method _getDataFromElm
         * @private
         * @param $elm {jQuery}
         * @return {Object}
         * <pre>
         *  index {Number} the selected option index
         *  str {String} the html of the selected option
         *  attr {Object} dictionary where keys are the attribute names and values are the
         *      attributes value
         * </pre>
         */
        _getDataFromElm: function($elm){
             var data = {};
             data.index = $elm.prevAll().size();
             data.str = $elm.html();
             data.attr = this._getAttr($elm.get(0));
             return data;
        },

        /**
         * user clicked on an option
         * @method _onItemClicked
         * @private
         * @param e {Event}
         */
        _onItemClicked: function(e){
            var $li = $(e.currentTarget);
            var data = this._getDataFromElm($li);
            this._setSelected(data.index);
            if( this._cfg.change ){
                this._cfg.change.call( this._cfg.context, data.str, data.index, data.attr );
            }
            this._hideDropdown();
        },
        /**
         * extract an elements attributes and return them as a dictionary object
         * @method _getAttr
         * @private
         * @param el {DOMElement}
         * @return {Object}
         */
        _getAttr: function(el){
            var attr = {};
            for( var i=0; i<el.attributes.length; i++ ){
                attr[el.attributes[i].nodeName] = el.attributes[i].nodeValue;
            }
            return attr;
        },

        /**
         * shows the select dropdown with the options elements
         * @method _showDropdown
         * @private
         */
        _showDropdown: function(){
            this._$boundingBox.find(".jcs-option-list").fadeIn(300);
        },

        /**
         * hides the select dropdown with the options elements
         * @method _hideDropdown
         * @private
         */
        _hideDropdown: function(){
            this._$boundingBox.find(".jcs-option-list").fadeOut(300);
        },

        /**
         * rendering the pseudo select component
         * @method _render
         * @private
         */
        _render: function(){
            this._$boundingBox = $(TEMPLATES.BOUNDING_BOX);
            this._addBoundingbox(this._$boundingBox);
            this._renderOptions();
            this._setSelected(this._cfg.selected)
        },

        /**
         * setting the selected index
         * @method _setSelected
         * @private
         * @param selected {Number} 0-base index
         */
        _setSelected: function(selected){
            if( typeof selected !== "number" ){
                selected = 0;
            }
            selected++;
            var $option = this._$boundingBox.find("ul.jcs-option-list li:nth-child("+selected+")");
            this._$selectedElm = $option;
            var html = $option.html();
            this._$boundingBox.find(".jcs-main-box").html(html);
        },

        /**
         * rendering the option
         * @method _renderOptions
         * @private
         */
        _renderOptions: function(){
            this._forEachOption(function(str,index,attr){
                var $option = $("<li></li>");
                if( this._cfg.optionContentCallback ){
                    str = this._cfg.optionContentCallback.call( this._cfg.context,str,index,attr );
                }
                $option.html(str);
                for( var id in attr ){
                    $option.attr(id,attr[id]);
                }
                this._$boundingBox.find("ul.jcs-option-list").append($option);
            });

            if( this._cfg.dropdownWidth ){
                this._$boundingBox.find("ul.jcs-option-list").width( this._cfg.dropdownWidth );
            }
            else if( this._$boundingBox.find("ul.jcs-option-list").width() < this._$boundingBox.width() ){
                //making sure the width is at least the width of the select
                this._$boundingBox.find("ul.jcs-option-list").width( this._$boundingBox.width() );
            }
        },

        /**
         * iteration method to get all the options we need to render.
         * this method either runs on the options we got in the configuration
         * or takes the actual OPTION element from the select element that was
         * set
         * @method _forEachOption
         * @private
         * @param cb {Function} iteration callback that will get 3 parameters: the html,
         *  the index and the attributes to set.
         */
        _forEachOption: function(cb){
            var optionsContent = this._getAllOptionsContent();
            var attr = this._getAllOptionsAttr();
            for( var i=0; i<optionsContent.length; i++ ){
                cb.call( this , optionsContent[i] , i , attr[i]||{});
            }
        },

        /**
         * get all the html content we need to set for all options
         * @method _getAllOptionsContent
         * @private
         * @return {Array}
         */
        _getAllOptionsContent: function(){
            if( this._cfg.options ) return this._cfg.options;
            var content = [];
            if( this._select.tagName === "SELECT" ){
                $(this._select).find("option").each(function(index,elm){
                    content.push($(elm).html());
                });
            }
            return content;
        },

        /**
         * get all the attributes for all the option we need to render.
         * @method _getAllOptionsAttr
         * @private
         * @return {Array} array of dictionaries for attributes
         */
        _getAllOptionsAttr: function(){
            if( this._cfg.attr ) return this._cfg.attr;
            var attr = [],
                that = this;
            if( this._select.tagName === "SELECT" ){
                $(this._select).find("option").each(function(index,elm){
                    attr.push( that._getAttr(elm) );
                });
            }
            return attr;
        },

        /**
         * adding the bounding box to the page. if we got a select element then we append
         * the boundingbox to the body and set it absolute. if we got a div container, we append it
         * to this container
         * @method _addBoundingbox
         * @private
         * @param $bbox {jQuery}
         */
        _addBoundingbox: function($bbox){
            if( this._select.tagName == "SELECT" ){
                $("body").append($bbox);
                $bbox.addClass("jcs-absolute");
                var offset = $(this._select).offset();
                $bbox.css(offset);
                $bbox.width( $(this._select).width() );
                $bbox.height( $(this._select).height() );
                $(this._select).css("visibility","hidden");
            }
            else{
                $(this._select).html($bbox);
            }
        }
    };

})(jQuery);
