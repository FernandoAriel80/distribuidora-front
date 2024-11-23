
export const validateForm = (fields, errors, form, validateFunction) => {
    let message = [];

    fields.forEach((value) => {
        const result = validateFunction(value, errors, form);
        if (result !== '') {
            message.push(result);
        }
    });
    return message.length === 0;
};

export const validateLogin = (field, errors, form) => {
    switch (field) {
        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            errors.email = form.value.email
                ? emailPattern.test(form.value.email)
                    ? form.value.email.length <= 255
                        ? ''
                        : 'El mail no debe exceder los 255 caracteres.'
                    : 'Correo no válido.'
                : 'El correo es requerido.';
            return errors.email;
        case 'password':
            errors.password = form.value.password.length >= 8
                ? ''
                : 'La contraseña debe tener al menos 8 caracteres.';
            return errors.password;
        default:
            errors[field] = 'Campo no reconocido.';
            return errors[field];
    }
};

export const validateRegister = (field, errors, form) => {
    switch (field) {
        case 'name':
            const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
            errors.name = form.value.name
                ? namePattern.test(form.value.name)
                    ? form.value.name.length <= 50
                        ? ''
                        : 'El nombre no debe exceder los 50 caracteres.'
                    : 'El nombre solo puede contener letras.'
                : 'El nombre es requerido.';
            return errors.name;
        case 'last_name':
            const lastNamePattern = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
            errors.last_name = form.value.last_name
                ? lastNamePattern.test(form.value.last_name)
                    ? form.value.last_name.length <= 50
                        ? ''
                        : 'El apellido no debe exceder los 50 caracteres.'
                    : 'El apellido solo puede contener letras.'
                : 'El apellido es requerido.';
            return errors.last_name;
        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            errors.email = form.value.email
                ? emailPattern.test(form.value.email)
                    ? form.value.email.length <= 255
                        ? ''
                        : 'El mail no debe exceder los 255 caracteres.'
                    : 'Correo no válido.'
                : 'El correo es requerido.';
            return errors.email;
        case 'password':
            errors.password = form.value.password
                ? form.value.password.length >= 8
                    ? ''
                    : 'La contraseña debe tener al menos 8 caracteres.'
                : 'La contraseña es requerido';
            return errors.password;
        case 'password_confirmation':
            errors.password_confirmation = form.value.password_confirmation
                ? form.value.password_confirmation.length >= 8
                    ? form.value.password_confirmation === form.value.password
                        ? ''
                        : 'Las contraseñas no coinciden'
                    : 'La contraseña debe tener al menos 8 caracteres.'
                : 'La contraseña es requerido';
            return errors.password_confirmation;
        default:
            errors[field] = 'Campo no reconocido.';
            return errors[field];
    }
};


export const validateProduct = (field, errors, form) => {
    switch (field) {
        case 'catalog_id':
            errors.catalog_id = form.value.catalog_id
                ? Number.isInteger(Number(form.value.catalog_id))
                    ? ''
                    : 'Debe ser un número entero.'
                : 'El ID de catálogo es requerido'
            return errors.catalog_id;

        case 'barcode':
            errors.barcode = form.value.barcode
                ? Number.isInteger(Number(form.value.barcode))
                    ? ''
                    : 'Debe ser un número entero.'
                : 'El código de barras es requerido'
            return errors.barcode;

        case 'name':
            // Validación de que solo contenga letras y números
            const namePattern = /^[a-zA-Z0-9\s]+$/;
            errors.name = form.value.name
                ? form.value.name.length <= 255
                    ? namePattern.test(form.value.name)
                        ? ''
                        : 'El nombre solo puede contener letras y números.'
                    : 'El nombre no debe superar los 255 caracteres.'
                : 'El nombre es requerido.';
            return errors.name;

        case 'description':
            const description = form.value.description;
            const isValidString = typeof description === 'string' && /^[a-zA-Z0-9.,\s:"']*$/.test(description);

            errors.description = isValidString
                ? ''
                : 'La descripción solo debe contener texto y algunos caracteres permitidos.';
            return errors.description;

        case 'unit_price':
            errors.unit_price = !isNaN(form.value.unit_price)
                ? form.value.unit_price >= 0
                    ? ''
                    : 'El precio unitario debe ser mayor o igual a 0.'
                : 'El precio unitario es requerido y debe ser numerico';
            return errors.unit_price;

        case 'bulk_unit_price':
            errors.bulk_unit_price = !isNaN(form.value.bulk_unit_price)
                ? form.value.bulk_unit_price >= 0
                    ? ''
                    : 'El precio por unidad en bulto debe ser un número mayor o igual a 0.'
                : 'El precio por unidad en bulto debe ser un número'
            return errors.bulk_unit_price;

        case 'bulk_unit':
            errors.bulk_unit = !isNaN(form.value.bulk_unit)
                ? form.value.bulk_unit >= 0 && form.value.bulk_unit <= 100
                    ? ''
                    : 'La cantidad en bulto debe estar entre 0 y 100.'
                : 'La cantidad en bulto debe debe ser un número'
            return errors.bulk_unit;

        case 'percent_off':
            errors.percent_off = !isNaN(form.value.percent_off)
                ? form.value.percent_off >= 0 && form.value.percent_off <= 100
                    ? ''
                    : 'El porcentaje de descuento debe estar entre 0 y 100.'
                : 'El porcentaje de descuento debe ser un número'
            return errors.percent_off;

        case 'offer':
            errors.offer = typeof form.value.offer === 'boolean'
                ? ''
                : 'La oferta debe ser un valor booleano (true o false).';
            return errors.offer;

        case 'price_offer':
            errors.price_offer = !isNaN(form.value.price_offer)
                ? form.value.price_offer >= 0
                    ? ''
                    : 'El precio de oferta debe ser un número mayor o igual a 0.'
                : 'El precio de oferta debe ser un número'
            return errors.price_offer;

        case 'old_price':
            errors.old_price = !isNaN(form.value.old_price)
                ? form.value.old_price >= 0
                    ? ''
                    : 'El precio anterior debe ser un número mayor o igual a 0.'
                : 'El precio anterior debe ser un número'
            return errors.old_price;

        case 'stock':
            errors.stock = typeof form.value.stock === 'boolean'
                ? ''
                : 'El stock debe ser un valor booleano (true o false).';
            return errors.stock;

        case 'image_url':
            // Validar si es un archivo de imagen válido
            const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
            errors.image_url = form.value.image_url != ''
                ? allowedFormats.includes(form.value.image_url.type)
                    ? ''
                    : 'La imagen debe ser de tipo jpeg, jpg o png.'
                : ''
            return errors.image_url;

        case 'category_id':
            errors.category_id = form.value.category_id
                ? Number.isInteger(Number(form.value.category_id))
                    ? ''
                    : 'Debe ser un número entero.'
                : 'La categoría es requerida';
            return errors.category_id;

        case 'type_id':
            errors.type_id = form.value.type_id
                ? Number.isInteger(Number(form.value.type_id))
                    ? ''
                    : 'Debe ser un número entero.'
                : 'La unidad de medida es requerido'
            return errors.type_id;

        default:
            errors[field] = 'Campo no reconocido.';
            return errors[field];
    }
};

export const validateRegisterEmpleado = (field, errors, form) => {
    switch (field) {
        case 'name':
            const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
            errors.name = form.value.name
                ? namePattern.test(form.value.name)
                    ? form.value.name.length <= 50
                        ? ''
                        : 'El nombre no debe exceder los 50 caracteres.'
                    : 'El nombre solo puede contener letras.'
                : 'El nombre es requerido.';
            return errors.name;
        case 'last_name':
            const lastNamePattern = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
            errors.last_name = form.value.last_name
                ? lastNamePattern.test(form.value.last_name)
                    ? form.value.last_name.length <= 50
                        ? ''
                        : 'El apellido no debe exceder los 50 caracteres.'
                    : 'El apellido solo puede contener letras.'
                : 'El apellido es requerido.';
            return errors.last_name;
        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            errors.email = form.value.email
                ? emailPattern.test(form.value.email)
                    ? form.value.email.length <= 255
                        ? ''
                        : 'El mail no debe exceder los 255 caracteres.'
                    : 'Correo no válido.'
                : 'El correo es requerido.';
            return errors.email;
        case 'password':
            if (form.value.password) {
                errors.password = form.value.password && form.value.password.length >= 8
                    ? ''
                    : 'La contraseña debe tener al menos 8 caracteres.';
                return errors.password;
            }else{
                return errors.password;
            }

        case 'password_confirmation':
            if (form.value.password_confirmation) {
                errors.password_confirmation = form.value.password_confirmation && form.value.password_confirmation.length >= 8
                    ? form.value.password_confirmation === form.value.password
                        ? ''
                        : 'Las contraseñas no coinciden'
                    : 'La contraseña debe tener al menos 8 caracteres.';
                return errors.password_confirmation;
            }else{
                return errors.password_confirmation;
            }

    }
};
