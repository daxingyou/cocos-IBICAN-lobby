   

import BaseLoadingPanel from "../../../libs/common/scripts/modules/assets/views/BaseLoadingPanel";
import LoadingPanel from "./views/LoadingPanel";
import AssetsContext from "../../../libs/common/scripts/modules/assets/AssetsContext";


export class LobbyAssetsContext extends AssetsContext{
    constructor(app: riggerIOC.ApplicationContext){
        super(app);
    }

   

    bindInjections():void{
        super.bindInjections();
        this.injectionBinder.bind(BaseLoadingPanel).to(LoadingPanel);
    }

    bindCommands(): void {
        super.bindCommands();
    }    

    bindMediators(): void {
        super.bindMediators();
    }

}