import { useState } from 'react';

export default function useForm(defaults) {
    const [values, setValues] = useState(defaults);

    function updateValue(e) {
        //check if its a number and convert
        let value = e.target.value;
        if(e.target.type === 'number') {
            value = parseInt(value);
        }

        setValues({
            //copy of the existing values
            ...values, 
            //update the new changed value
            [e.target.name]: value
        });
    }

    return { values, updateValue };
}