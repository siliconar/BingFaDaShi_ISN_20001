export class Utils  {


    static generateUniqueString(str1: string, str2: string): string {
        // 确保字符串按字典顺序排序
        const [first, second] = [str1, str2].sort();
        return `${first}_${second}`;
    }
    
    



}