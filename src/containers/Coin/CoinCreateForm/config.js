
const formSchema = [
    {
        name: 'type',
        text: 'type',
        type: 'select'
    },
    {
        name: 'iconFile',
        text: 'icon',
        type: 'image',
        component: 'components/UI/Form/Upload/CustomImageInput/CustomImageInput',
        props: {}
    },
    {
        name: 'coinName',
        text: 'Coin Name',
        type: 'text',
        component: 'components/UI/Form/Input/TextInput',
        props: {}
    },
    {
        name: 'coinSymbol',
        text: 'Coin Symbol',
        type: 'text',
        component: 'components/UI/Form/Input/TextInput',
        props: {}
    },
    {
        name: 'initialSupply',
        text: 'Supply',
        type: 'number',
        component: 'components/UI/Form/Input/TextInput',
        props: {}
    },
    // {
    //     name: 'cap',
    //     text: 'Max Supply',
    //     type: 'number',
    //     component: 'components/UI/Form/Input/TextInput',
    //     props: {
    //         optional: true
    //     }
    // },
    {
        name: 'coinDescription',
        text: 'Coin Description',
        type: 'multiline',
        component: 'components/UI/Form/Input/TextInput',
        props: {}
    },
    {
        name: 'contractFile',
        text: 'Contract Document',
        type: 'file',
        component: 'components/UI/Form/Upload/CustomFileInput/CustomFileInput',
    }

    // {   //Step 1
    //     title: "Step 1: Define Coin",
    //     fields: [
    //         {
    //             name: 'iconFile',
    //             text: '',
    //             component: 'components/UI/Form/Upload/CustomImageInput/CustomImageInput',
    //             props: {}
    //         },
    //         {
    //             name: 'coinName',
    //             text: '',
    //             component: 'components/UI/Form/Input/TextInput',
    //             props: {}
    //         },
    //         {
    //             name: 'coinSymbol',
    //             text: '',
    //             component: 'components/UI/Form/Input/TextInput',
    //             props: {}
    //         },
    //         {
    //             name: 'initialSupply',
    //             text: '',
    //             component: 'components/UI/Form/Input/TextInput',
    //             props: {}
    //         },
    //         {
    //             name: 'maxSupply',
    //             text: '',
    //             component: 'components/UI/Form/Input/TextInput',
    //             props: {
    //                 optional: true
    //             }
    //         },
    //     ]
    // },
    // { //Step 2
    //     title: "Step 2: Terms And Conditions",
    //     fields: [
    //         {
    //             name: 'coinDescription',
    //             text: '',
    //             component: 'components/UI/Form/Upload/CustomFileInput/CustomFileInput',
    //             props: {}
    //         }
    //     ]
    // }
    ];

export default formSchema;