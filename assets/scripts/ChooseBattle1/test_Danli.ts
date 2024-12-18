import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test_Danli')
export class test_Danli extends Component {

    //---- 单例
    static Instance: test_Danli

    protected onLoad(): void {
        
        test_Danli.Instance = this

    }


    name1:string;

    start() {

        this.name1 = this.node.name;

    }

    update(deltaTime: number) {

    }



    onclick()
    {
        console.log(this.name1)
        console.log(test_Danli.Instance.name1)
    }

}


