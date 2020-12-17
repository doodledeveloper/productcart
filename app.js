let products = [
    {
        product_id : 1,
        product_name : 'product A',
        price : 30
    },
    {
        product_id : 2,
        product_name : 'product B',
        price : 20
    },
    {
        product_id : 3,
        product_name : 'product C',
        price : 50
    },
    {
        product_id : 4,
        product_name : 'product D',
        price : 15
    }
];

let product_offers = [
    {
        product_id : 1,
        type : 'qty',
        amount : 75,
        multiples_qty : 3
    },
    {
        product_id : 2,
        type : 'qty',
        amount : 35,
        multiples_qty : 2
    }
];

let cart_offers = [
    {
        total_cart_value : 150,
        discount : 20,
        discount_type : 'amount'
    }
];

let cart = [
    {
        product_id : 1,
        qty : 3
    },
    {
        product_id : 3,
        qty : 1
    },
    {
        product_id : 4,
        qty : 1
    }
];

let cartOperations = {
    totalCartValue : function(cart){
        let self = this;
        let totalValue = 0;
        for(let i = 0; i < cart.length; i++){
            let item = cart[i];
            let product = self.getProductDetails(item.product_id);
            if(product){
                let product_total = (item.qty * product.price);
                totalValue += product_total;
                console.log(item)
            }else{
                console.log("invalid product in cart");
                break;
            }
        }
        return totalValue;
    },
    getProductDetails : function(product_id){
        let self = this;
        for(let i = 0; i < products.length; i++){
            if(product_id == products[i].product_id){
                return products[i];
            }
        }
        return false;
    },
    getProductOffer : function(product_id){
        let self = this;
        for(let i = 0; i<product_offers.length; i++){
            if(product_id == product_offers[i].product_id)
                return product_offers[i];
        }
        return false;
    },
    calculateCartDiscount : function(totalValue){
        let self = this;
        for(let i = 0; i<cart_offers.length; i++){
            let offer = cart_offers[i];
            //highest applicable cart value will be chosen for offer
            if(totalValue > offer.total_cart_value){
                if(offer.discount_type == 'amount'){
                    totalValue = totalValue - offer.discount;
                }
            }
        }
        return totalValue;
    },
    calculateTotalAfterDiscount : function(cart){
        let self = this;
        let totalValue = 0;
        for(let i = 0; i < cart.length; i++){
            let item = cart[i];
            let product = self.getProductDetails(item.product_id);
            if(product){
                let qty = item.qty;
                let offer = self.getProductOffer(item.product_id);
                if(offer){
                    if(offer.type == 'qty'){
                        let multiples = offer.multiples_qty;
                        let qualified_set = parseInt(qty/multiples);
                        let singles = 0;
                        if(qty%multiples != 0){
                            singles = qty%multiples;
                        }
                        let offer_price = offer.amount * qualified_set;
                        let without_offer_price = singles * product.price;
                        let finalProductPricing = offer_price + without_offer_price;
                        totalValue += finalProductPricing;
                        //console.log("For "+product.product_name+" : "+finalProductPricing);
                    }
                }else{
                    let normalProductCost = product.price * qty;
                    //console.log("cost for "+product.product_name+" : "+normalProductCost);
                    totalValue += normalProductCost;
                }
            }else{
                console.log("invalid product in cart");
                break;
            }
        }
        totalValue = self.calculateCartDiscount(totalValue);
        return totalValue;
    }
};

console.log("Final Payable Amount After Discount",cartOperations.calculateTotalAfterDiscount(cart));