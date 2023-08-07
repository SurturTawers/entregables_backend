export const findCartById = (cid) => {
    return {
        $match: {
            $expr: {
                $eq: [
                    '$_id',
                    {
                        $toObjectId: cid
                    },
                ]
            }
        }
    }
}

export const unwindCartProducts = {
    //desenvuelve el array
    $unwind: "$products"
}
export const groupProductsById = {
    //agrupa por id y los cuenta
    $group: {
        _id: "$products",
        count: {
            $sum: 1
        }
    }
}

export const getProductInfoByGroup = {
    //obtengo el producto por grupo
    $lookup: {
        from: 'products',
        localField: "_id",
        foreignField: "_id",
        as: "productInfo"
    }
}

export const unwindProductInfo = {
    //desenvuelvo el array de info
    $unwind: "$productInfo"
}

export const obtenerCamposRequeridosShowCart= {
    //obtengo los campos que necesito
    $project: {
        "_id": 1,
        "count": 1,
        "productInfo.title": 1
    }
}

export const obtenerCamposRequeridosCheckout = {
    //obtengo los campos que necesito
    $project: {
        "_id": 1,
        "count": 1,
        "productInfo.price": 1,
        "productInfo.stock": 1,
    }
}
