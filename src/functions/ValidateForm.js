
export const validateForm = (fields, errors, form, validateFunction) => {
    let message;
    fields.forEach((value) => {
        message = validateFunction(value, errors, form);
    })
    return !message;
};

export const validateRegister = (field, errors, form) => {
    switch (field) {
        case 'name':
            errors.name = form.name ? '' : 'El nombre es requerido.';
            return errors.name;
        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            errors.email = form.email
                ? emailPattern.test(form.email)
                    ? ''
                    : 'Correo no válido.'
                : 'El correo es requerido.';
                return errors.email;
        case 'password':
            errors.password = form.password.length >= 6
                ? ''
                : 'La contraseña debe tener al menos 8 caracteres.';
                return errors.password;
    }
};

export const validateProduct = (field, errors, form) => {
    switch (field) {
        case 'catalog_id':
            console.log(Number.isInteger(Number(form.catalog_id)))
            errors.catalog_id = form.catalog_id && Number.isInteger(Number(form.catalog_id))
                ? ''
                : 'El ID de catálogo es requerido y debe ser un número entero.';
            return errors.catalog_id;

        case 'barcode':
            errors.barcode = form.barcode && Number.isInteger(Number(form.barcode))
                ? ''
                : 'El código de barras es requerido y debe ser un número entero.';
            return errors.barcode;

        case 'name':
            errors.name = form.name
                ? form.name.length <= 255
                    ? ''
                    : 'El nombre no debe superar los 255 caracteres.'
                : 'El nombre es requerido.';
            return errors.name;

        case 'description':
            errors.description = form.description && typeof form.description === 'string'
                ? ''
                : 'La descripción debe ser un texto.';
            return errors.description;

        case 'unit_price':
            errors.unit_price = form.unit_price && !isNaN(form.unit_price) && form.unit_price >= 0
                ? ''
                : 'El precio unitario debe ser un número mayor o igual a 0.';
            return errors.unit_price;

        case 'bulk_unit_price':
            errors.bulk_unit_price = form.bulk_unit_price && !isNaN(form.bulk_unit_price) && form.bulk_unit_price >= 0
                ? ''
                : 'El precio por unidad en bulto debe ser un número mayor o igual a 0.';
            return errors.bulk_unit_price;

        case 'bulk_unit':
            errors.bulk_unit = form.bulk_unit && !isNaN(form.bulk_unit) && form.bulk_unit >= 0 && form.bulk_unit <= 100
                ? ''
                : 'La cantidad en bulto debe estar entre 0 y 100.';
            return errors.bulk_unit;

        case 'percent_off':
            errors.percent_off = form.percent_off && !isNaN(form.percent_off) && form.percent_off >= 0 && form.percent_off <= 100
                ? ''
                : 'El porcentaje de descuento debe estar entre 0 y 100.';
            return errors.percent_off;

        case 'offer':
            errors.offer = typeof form.offer === 'boolean'
                ? ''
                : 'La oferta debe ser un valor booleano (true o false).';
            return errors.offer;

        case 'price_offer':
            errors.price_offer = form.price_offer && !isNaN(form.price_offer) && form.price_offer >= 0
                ? ''
                : 'El precio de oferta debe ser un número mayor o igual a 0.';
            return errors.price_offer;

        case 'old_price':
            errors.old_price = form.old_price && !isNaN(form.old_price) && form.old_price >= 0
                ? ''
                : 'El precio anterior debe ser un número mayor o igual a 0.';
            return errors.old_price;

        case 'stock':
            errors.stock = typeof form.stock === 'boolean'
                ? ''
                : 'El stock debe ser un valor booleano (true o false).';
            return errors.stock;

        case 'image_url':
            // Validar si es un archivo de imagen válido
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
            errors.image_url = form.image_url && allowedFormats.includes(form.image_url.type)
                ? ''
                : 'La imagen debe ser de tipo jpeg, jpg o png.';
            return errors.image_url;

        case 'category_id':
            errors.category_id = form.category_id && Number.isInteger(Number(form.category_id))
                ? ''
                : 'La categoría es requerida y debe ser un número entero.';
            return errors.category_id;

        case 'type_id':
            errors.type_id = form.type_id && Number.isInteger(Number(form.type_id))
                ? ''
                : 'El tipo es requerido y debe ser un número entero.';
            return errors.type_id;

        default:
            errors[field] = 'Campo no reconocido.';
            return errors[field];
    }
};
