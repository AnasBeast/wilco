import { ValidationError } from "@nestjs/common";

export function transfromErrors(validationErrors: ValidationError[]) {
    const errors = validationErrors[0].children.map((error: ValidationError) => {
        const err = {};
        if(error.constraints) {
            appendToErrors(err, error.property, error.constraints)
        }

        if(error.children) {
            error.children.map((error) => {
                if(error.constraints) {
                    appendToErrors(err, error.property, error.constraints)
                }
            })
        }

        console.log(Object.keys(err));
        // if(!error.constraints && error.children) {
        //     return error.children.map((child_error) => {
        //         return child_error;
        //     })
        // }
    });

    // console.log(errors);
    
}

function appendToErrors(obj, prop, errors) {
    // console.log(prop);
    if (obj[prop]) {
        obj[prop] = [...obj[prop], ...Object.values(errors)]
    }else {
        obj[prop] = Object.values(errors)
    }
}