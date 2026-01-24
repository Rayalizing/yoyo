// 工具函数模块
const Utils = (function() {
    // 获取字符图片URL
    function getCharImageUrl(char) {
        // 处理空格字符，返回一个占位符图片或者透明图片
        if (char === ' ') {
            return `/zigen_table/char_images/empty.png`;
        }
        const unicode = char.codePointAt(0).toString(16).toLowerCase();
        return '../zigen_table/char_images/' + unicode + '.png';
    }

    // 获取字根组信息
    function getZigenGroup(mainChar) {
        const group = {
            main: mainChar,
            sub: []
        };
        
        if (typeof ZIGEN_GROUPS !== 'undefined' && ZIGEN_GROUPS[mainChar]) {
            group.sub = ZIGEN_GROUPS[mainChar];
        }
        
        return group;
    }

    return {
        getCharImageUrl: getCharImageUrl,
        getZigenGroup: getZigenGroup
    };
})();
