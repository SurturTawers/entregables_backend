import productsModel from '../db/models/products.js';
class ProductsController{
    static async getProducts(limit, page, sort, query){
        const pagRes = await productsModel.paginate(query?{query}:{},{limit:limit?limit:10,page:page?page:1,sort:sort?sort:0});
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

    static async createProduct(product){
        try{
            const result =  await productsModel.create(product);
            return {result: result};
        }catch(error){
            console.log(error);
            return {error: error};
        };
    }

    static async getProductById(id){
        return await productsModel.findOne({_id:id});
    }

    static async updateProductById(id, fields){
        return await productsModel.updateOne({_id:id},{$set:fields});
    }

    static async deleteProductById(id){
        return await productsModel.deleteOne({_id:id});
    }
}

export default ProductsController;