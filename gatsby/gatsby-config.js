import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default {
    siteMetadata: {
        title: `Slicks Slices`,
        siteUrl: `https://gatsby.pizza`,
        description: `The best pizza place this side of the Mississippi`,
        twitter: '@slicksSlices'
    },
    plugins: [
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-styled-components',
        {
            //the name of the plugin you are adding
            resolve: 'gatsby-source-sanity',
            options: {
                projectId: '063rpgan',
                dataset: 'production',
                watchMode: true,
                token: process.env.SANITY_TOKEN
            }
        }
    ]
};