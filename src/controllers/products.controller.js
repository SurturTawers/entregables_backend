import ProductsServices from '../services/products.services.js';
class ProductsController{
    static getProducts(limit, page, sort, query){
        const pagRes = ProductsServices.getAll(limit,page,sort,query);
        //console.log(pagRes);
        return {
            responseData: {
                status: "ok",
                payload: pagRes.docs,
                totalPages: pagRes.totalPages,
                prevPage: pagRes.prevPage,
                nextPage: pagRes.nextPage,
                page: pagRes.page,
                hasPrevPage: pagRes.hasPrevPage,
                hasNextPage: pagRes.hasNextPage,
                prevLink: pagRes.hasPrevPage?`http://localhost:${process.env.APP_PORT}+"/api/products?limit=${limit?limit:10}&page=${page?page-1:null}&${sort?`sort=${sort}`:null}&${query?`query=${query}`:null}`:null,
                nextLink: pagRes.hasNextPage?`http://localhost:${process.env.APP_PORT}+"/api/products?limit=${limit?limit:10}&page=${page?page+1:null}&${sort?`sort=${sort}`:null}&${query?`query=${query}`:null}`:null
            },
            pagRes:pagRes
        };
    }

    static createProduct(product){
        try{
            const result = ProductsServices.create(product);
            return {result: result};
        }catch(error){
            console.log(error);
            return {error: error};
        };
    }

    static getProductById(id){
        return ProductsServices.getById(id);
    }

    static updateProductById(id, fields){
        return ProductsServices.update(id, fields);
    }

    static deleteProductById(id){
        return ProductsServices.delete(id);
    }
}

export default ProductsController;