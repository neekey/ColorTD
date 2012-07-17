(function main (argument) {

    var DB_NAME = 'ColorTD';
    
    $(document).ready(function(){

        var contentDiv = $( '#content' );

        // 添加新item 容器
        var newItemDiv = contentDiv.children( '.new-item' );
        // 新标题 表单
        var newTitleIpt = $( '.J-new-title' );
        // 新详情 表单
        var newDescTextarea = $( '.J-new-desc' );
        // 提交按钮
        var newItemSubmit = $( '.J-add-item' );

        // 列表 容器
        var itemListDiv = contentDiv.children( '.item-list' );
        // 工具栏
        var toolbarDiv = itemListDiv.children( '.tool-bar' );
        // item列表
        var itemListUl = itemListDiv.children( '.list' );


        /**
         * 新item添加模块
         */
        (function function_name (argument) {
            
            newItemSubmit.bind( 'click', function addNewItem( e ){

                var newTitle = newTitleIpt.val();
                var newDesc = newDescTextarea.val();

                if( !newTitle ){
                    alert( 'title must be provided!' );
                }
                else {
                    newTitleIpt.val('');
                    newDescTextarea.val( '' );

                    itemListController.addNewItem( newTitle, newDesc );
                }

                e.preventDefault();
            });
        })();

        /**
         * item list 逻辑
         */
        var itemListController = (function(){

            var itemTpl = $( '#item-tpl' ).html();

            var module = {
                /**
                 * 添加一个新的item
                 * @param {String} title
                 * @param {String} desc
                 * @return uuid
                 */
                addNewItem: function( title, desc ){
                    var uuid = listStore.addItem( title, desc );

                    this.addItem({
                        title: title,
                        desc: desc,
                        uuid: uuid
                    });

                    return uuid
                },
                /**
                 * 根据给定的item信息，添加对应的dom结构
                 * @param {Object} item
                 */
                addItem: function( item ){

                    var newItem = $( Mustache.render( itemTpl, item));

                    itemListUl.append( newItem );
                },
                /**
                 * 从列表中删除item
                 */
                removeItem: function( item ){
                    var uuid = $( item ).attr( 'data-uuid' );
                    $( item ).remove();

                    listStore.removeItem( uuid );
                },
                /**
                 * 初始化列表
                 */
                init: function initSavedItems () {
                  
                    var savedItems = listStore.getAll();
                    var item;
                    var i;

                    for( i = 0; item = savedItems[ i ]; i++ ){

                        this.addItem( item )
                    }

                    this.attach();
                },

                attach: function eventLogic (argument) {
                    
                    var that = this;

                    // 删除逻辑
                    itemListUl.delegate( '.remove-item', 'click', function( e ){
                        
                        var li = $( this ).parents( 'li' );

                        that.removeItem( li );

                        e.preventDefault();
                    })   
                }};

            return module;

        })();

        /**
         * 用于本地存储的模块
         */
        var listStore = (function(){

            // 判断是否已经初始化过
            var listData = JSON.parse( localStorage.getItem( DB_NAME ) );
            var ifInit = !!listData;

            if( !ifInit ){

                listData = {
                    currentUUID: 0,
                    items: {}
                };

                localStorage.setItem( DB_NAME, JSON.stringify( listData ) );
            }

            return {
                /**
                 * 返回所有的item数据
                 * {
                 *  title: 'title', desc: 'desc', uuid: 'uuid'  
                 * }
                 */
                getAll: function(){

                    var list = [];
                    var item;
                    var uuid;

                    for( uuid in listData.items ){

                        list.push({
                            title: listData.items[ uuid ].title,
                            desc: listData.items[ uuid ].desc,
                            uuid: uuid
                        });
                    }

                    return list;
                },
                /**
                 * 向数据库中添加新的item
                 * @param title 
                 * @param desc
                 * @return uuid
                 */
                addItem: function( title, desc ){

                    var newId = ++listData.currentUUID;
                    var newItem = { 
                        title: title,
                        desc: desc
                    };

                    listData.items[ newId ] = newItem;

                    this.save();

                    return newId;
                },
                /**
                 * 将内存中的 listData 保存到db中
                 */
                save: function(){
                    localStorage.setItem( 'ColorTD', JSON.stringify( listData ) );          
                },
                /**
                 * 从db中删除制定uuid的 item
                 */
                removeItem: function( uuid ){

                    delete listData.items[ uuid ];

                    this.save();
                }
            }
        })();

        (function main (argument) {
            
            itemListController.init();  
        })();
    });
})();