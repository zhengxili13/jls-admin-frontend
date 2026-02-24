import { MatChipInputEvent } from '@angular/material/chips';

import { FuseUtils } from '@fuse/utils';

export class Item
{
    id: number;
    parentId: number;
    value : string;
    order : string;
    validity: boolean;
    code : string;
    referenceCategoryId : number;
    frLabel : string;
    enLabel : string;
    cnLabel : string;
    label : string;

    /**
     * Constructor
     *
     * @param item
     */
    constructor(item?)
    {
        item = item || {};
        this.id = item.id || 0;
        this.parentId = item.parentId || 0;
        this.value = item.value || "";
        this.referenceCategoryId = item.referenceCategoryId || 0;
        this.validity = item.validity || true;
        this.code = item.code || "";
        this.label = item.label;

        if(item.label){
            this.frLabel = item.labels.find(n => n.lang == 'fr').label;
            this.enLabel = item.labels.find(n => n.lang == 'en').label;
            this.cnLabel = item.labels.find(n => n.lang == 'cn').label;
        }else{
            this.frLabel = '';
            this.enLabel = '';
            this.cnLabel = '';
        }
    }
}