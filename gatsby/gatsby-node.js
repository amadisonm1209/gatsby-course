import path from 'path';
import fetch from 'isomorphic-fetch';

async function turnPizzasIntoPages({ graphql, actions }) {
    //get a template for this page
    const pizzaTemplate = path.resolve('./src/templates/Pizza.js');
    //query all pizzas
    const { data } = await graphql(`
        query {
            pizzas: allSanityPizza{
                nodes {
                    name 
                    slug {
                        current
                    }
                }
            }
        }
    `)
    //loop over all pizzas and create a page for it
    data.pizzas.nodes.forEach(pizza => {
        actions.createPage({
            //what is the url for the new page
            path: `pizza/${pizza.slug.current}`,
            component: pizzaTemplate,
            //passes info to the template page
            context: {
                slug: pizza.slug.current
            }

        })
    });
}

async function turnToppingsIntoPages({ graphql, actions }) {
    //get the template
    const toppingsTemplate = path.resolve('./src/pages/pizzas.js');
    //query all the toppings
    const { data } = await graphql(`
        query {
            toppings: allSanityTopping {
                nodes {
                    name
                    id
                }
            }
        }
    `);
    //createPage for that topping 
    data.toppings.nodes.forEach(topping => {
        actions.createPage({
            //what is the url for the new page
            path: `topping/${topping.name}`,
            component: toppingsTemplate,
            //passes info to the template page
            context: {
                topping: topping.name,
                //TODO regex for topping
                toppingRegex: `/${topping.name}/i`
            }
        })
    });
    //pass topping data to pizza.js
}

async function fetchBeersAndTurnIntoNodes({ actions, createNodeId, createContentDigest }) {
    //fetch list of beers 
    const res = await fetch('https://sampleapis.com/beers/api/ale');
    const beers = await res.json();
    //loop over each one 
    for (const beer of beers) {
        const nodeMeta = {
            id: createNodeId(`beer-${beer.name}`),
            parent: null,
            children: [],
            internal: {
                type: 'Beer',
                mediaType: 'application/json', //so other plugins can find the type of media
                contentDigest: createContentDigest(beer),
            }
        };
        //create a node for that beer
        actions.createNode({
            ...beer,
            ...nodeMeta,
        })
    }
}

async function turnSlicemastersIntoPages({ graphql, actions }) {
    //query all slicemasters 
    const { data } = await graphql(`
        query {
            slicemasters: allSanityPerson {
                totalCount
                nodes {
                    name
                    id
                    slug {
                        current
                    }
                }
            }
        }
    `)
    //turn each into their own page 
    data.slicemasters.nodes.forEach(slicemaster => {
        actions.createPage({
            component: path.resolve('./src/templates/Slicemaster.js'),
            path: `/slicemaster/${slicemaster.slug.current}`,
            context: {
                name: slicemaster.person,
                slug: slicemaster.slug.current
            }
        })
    });
    //figure out how many pages there are based on how many people 
    const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
    const pageCount = Math.ceil(data.slicemasters.totalCount / pageSize);
    //loop from 1 to n - number of pages 
    Array.from({ length: pageCount }).forEach((_, i) => {
        actions.createPage({
            path: `/slicemasters/${i + 1}`,
            component: path.resolve('./src/pages/slicemasters.js'),
            context: {
                skip: i * pageSize,
                currentPage: i + 1,
                pageSize,
            }
        })
    })
}

export async function sourceNodes(params) {
    //fetch list of beers and source them into Gatsby api
    await Promise.all([
        fetchBeersAndTurnIntoNodes(params)
    ]);
}

export async function createPages(params) {
    //create pages dynamically
    //pizzas and toppings and slicemasters
    //wait for all promises to resolve before finishing this function
    await Promise.all([
        turnPizzasIntoPages(params),
        turnToppingsIntoPages(params),
        turnSlicemastersIntoPages(params),
    ]);
};

