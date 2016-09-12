/**
 * Utility
 */
class Utility {

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    public static createBitmapByName(name: string): egret.Bitmap {
        var result = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    public static testCollision(obj1: egret.DisplayObject, obj2: egret.DisplayObject): boolean {
        return obj1.getTransformedBounds(obj1.parent).intersects(obj2.getTransformedBounds(obj2.parent));
    }

    public static configureCenteredTextField(textField: egret.TextField, fontSize: number, text: string, offsetY: number): void {
        textField.size = fontSize;
        textField.text = text;
        textField.x = textField.stage.stageWidth >> 1;
        textField.y = (textField.stage.stageHeight >> 1) + offsetY;
        textField.anchorOffsetX = textField.width >> 1;
        textField.anchorOffsetY = textField.height >> 1;
    }

}