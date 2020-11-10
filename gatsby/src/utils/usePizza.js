import { useState, useContext } from "react";
import OrderContext from '../components/OrderContext';
import attachNamesAndPrices from "./attachNamesAndPrices";
import calculateOrderTotal from "./calculateOrderTotal";
import formatMoney from "./formatMoney";

export default function usePizza({ pizzas, values }) {
    //create state to hold order, but make it a high level Provider state
    // const [order, setOrder] = useState([]);
    const [order, setOrder] = useContext(OrderContext);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    //make a fn to add to order 
    function addToOrder(orderedPizza) {
        setOrder([...order, orderedPizza]);
    }
    //make a fn to remove from order 
    function removeFromOrder(index) {
        setOrder([
            //everything before the item we want to remove 
            ...order.slice(0, index),
            //everything after the one we want to remove
            ...order.slice(index + 1),
        ]);
    }
    //this will run when someone submits the form
    async function submitOrder(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        //gather all the data 
        const body = {
            order: attachNamesAndPrices(order, pizzas),
            total: formatMoney(calculateOrderTotal(order, pizzas)),
            name: values.name,
            email: values.email,
            mapleSyrup: values.mapleSyrup
        }
        //send data to the serverless function when they checkout
        const res = await fetch(`${process.env.GATSBY_SERVERLESS_BASE}/placeOrder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const text = JSON.parse(await res.text());
        //check if everything worked
        if(res.status >= 400 && res.status < 600) {
            setLoading(false); //turn off loading
            setError(text.message);
        } else {
            setLoading(false);
            setMessage('Success! Come on down and grab your pizzas!');
        }
    }



    return {
        order,
        addToOrder,
        removeFromOrder,
        error,
        loading,
        message,
        submitOrder
    }
}