import React from 'react';
import S from '@sanity/desk-tool/structure-builder';
import storeSettings from './schemas/storeSettings';

//build a custom sidebar

export default function Sidebar() {
    return S.list().title(`Slick's Slices`).items([
        //create a new sub item
        S.listItem()
        .title('Home Page')
        .icon(() => <strong>🔥</strong>)
        .child(
            S.editor()
            .schemaType('storeSettings')
            //make a new document id so we dont have a random string
            .documentId('downtown')
        ),
        //add in the rest of the document items
        ...S.documentTypeListItems().filter(item => item.getId() !== 'storeSettings')
    ])
}