
let keyBind = [
    'h', 'ArrowLeft',//left
    't', 'ArrowUp',
    'n', 'ArrowDown',
    's', 'ArrowRight'
];


let sub1 = [
    'a', 'sub1 - > a',
    '1', 'sub1 - > 1',
    '2', 'sub1 - > 2',
    '3', 'sub1 - > 3',
    '4', {name: 'sub1 / 4', sub:[
        '1','sub1 / 4 - 1',
        '2','sub1 / 4 - 2'
        ]},
    'Control + s', 'Sub1 save ...', // this not work
    
];


let keyMap1 = [


//'Shift + ~', {name: 'submenu test', sub: sub1},

// [x]
'Shift + ?', 'keyboard shortcuts map',


// [x]
'Control + s', 'save ...',
// [x]
'Control + ArrowRight', 'save ...',

// [x]
' ', 'play / stop',
// [x]
'ArrowLeft', 'seek left',
// [x]
'ArrowRight', 'seek right',
// [x]
'u + ArrowLeft', 'seek to 0',
// [x]
'u + ArrowRight', 'seek to end',
// [x]
'a + ArrowLeft', 'set clip START',
// [x]
'a + ArrowRight', 'set clip END',
// [x]
'o + ArrowLeft', 'jump to clip START',
// [x]
'o + ArrowRight', 'jump to clip END',
// [x]
'e + ArrowUp', 'select video above',
// [x]
'e + ArrowDown', 'select video lower',


// [x]
'1', 'stabiline toggle',
// [x]
'2', 'rot -',
// [x]
'3', 'rot +',
// [x]
'Alt + 1', 'focus on comments',
// [x]
'Alt + 2', 'focus on tags',
// [ ]
'Alt + 3', 'exit comments or tags focus',

// [x]
'Shift + G', 'ok',
// [x]
'Shift + M', 'mayby',
// [x]
'Shift + D', 'delete',
// [x]
'Shift + N', 'no'

];

export { keyBind,keyMap1 }