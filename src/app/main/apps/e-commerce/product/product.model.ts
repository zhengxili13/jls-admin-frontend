import { MatChipInputEvent } from '@angular/material/chips';

import { FuseUtils } from '@fuse/utils';

export class Product
{
    id: string;
    frName: string;
    enName : string;
    cnName : string;
    handle: string;
    reference : string;
    description: string;
    category: number;
    mainCategory : number;
    images: {
        status: string,
        id: string,
        path: string | ArrayBuffer,
        name:string
    }[];
    price : number;
    taxRate: number;
    size: string;
    color: string;
    material: string;
    quantityPerBox: number;
    minQuantity: number;
    active: boolean;

    /**
     * Constructor
     *
     * @param product
     */
    constructor(product?)
    {
        product = product || {};
        this.id = product.id || 0;
        this.reference = product.referenceCode || '';
        this.description = product.description || '';
        this.category = product.category || 0;
        this.images = product.images || [];
        this.taxRate = product.taxRate || 0;      
        this.size = product.size || 0;
        this.color = product.color || '';
        this.material = product.material || '';
        this.quantityPerBox = product.quantityPerBox || 0;
        this.minQuantity = product.minQuantity || 0;
        this.active = product.active || true;
        this.price = product.price || 0;

        if(product.label){
            this.frName = product.label.find(n => n.lang == 'fr').label;
            this.enName = product.label.find(n => n.lang == 'en').label;
            this.cnName = product.label.find(n => n.lang == 'cn').label;
        }else{
            this.frName = '';
            this.enName = '';
            this.cnName = '';
        }

        this.images.forEach(image => {
            image.status = 'save';
            image.name = image.path.toString().split("/")[1];
        });
        

        

        
    }
}
