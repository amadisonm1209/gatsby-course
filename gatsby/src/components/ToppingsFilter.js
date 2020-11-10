import { useStaticQuery, graphql, Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';

const ToppingsStyles = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 4rem;
    a {
        align-items: center;
        background: var(--grey);
        border-radius: 2px;
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 0 1rem;
        padding: 5px;
        text-decoration: none;
        font-size: clamp(1.5rem, 1.4vw, 2.5rem);
        .count {
            background: white;
            padding: 2px 5px;
        }
        &[aria-current='page'] {
            background: var(--yellow);
        }
    }
`;


function countPizzaInToppings(pizzas) {
    //return the pizza number with the counts
    const counts = pizzas
        .map(pizza => pizza.toppings)
        .flat()
        .reduce((acc, topping) => {
            //check if this is an existing topping
            const existingTopping = acc[topping.id];
            //if it is, increment 1, else create a new entry in our acc and set it to one
            if (existingTopping) {
                existingTopping.count += 1;
            } else {
                acc[topping.id] = {
                    id: topping.id,
                    name: topping.name,
                    count: 1,
                };
            }
            return acc;
        }, {});
    //sort based on count 
    const sortedToppings = Object.values(counts).sort((a, b) => b.count - a.count);
    return sortedToppings;
}

export default function ToppingsFilter({ activeTopping }) {
    //get a list of all the toppings and pizzas with their toppings
    const { pizzas } = useStaticQuery(graphql`
        query {
            pizzas: allSanityPizza {
                nodes {
                    toppings {
                        name
                        id
                    }
                }
            }
        }
    `);

    //count how many pizzas have each topping
    const toppingsWithCounts = countPizzaInToppings(pizzas.nodes);

    //loop over list of toppings and display topping and count
    //link it up
    return (
        <ToppingsStyles>
            <Link to="/pizzas">
                <span className="name">All</span>
                <span className="count">{pizzas.nodes.length}</span>
            </Link>
            {toppingsWithCounts.map(topping => (
                <Link to={`/topping/${topping.name}`} key={topping.id}>
                    <span className="name">{topping.name}</span>
                    <span className="count">{topping.count}</span>
                </Link>
            ))}
        </ToppingsStyles>
    )
}