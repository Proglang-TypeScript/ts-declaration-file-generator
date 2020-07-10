J$.iids = {"9":[1,16,1,23],"17":[1,24,1,37],"25":[1,16,1,38],"33":[1,16,1,38],"41":[1,16,1,38],"49":[3,1,3,9],"57":[3,31,3,38],"65":[3,22,3,40],"73":[3,1,3,41],"75":[3,1,3,21],"81":[3,1,3,42],"89":[4,1,4,9],"97":[4,30,4,37],"105":[4,22,4,38],"113":[4,40,4,44],"121":[4,1,4,45],"123":[4,1,4,21],"129":[4,1,4,46],"137":[5,1,5,9],"145":[5,30,5,37],"153":[5,22,5,38],"161":[5,1,5,39],"163":[5,1,5,21],"169":[5,1,5,40],"177":[6,1,6,9],"185":[6,31,6,38],"193":[6,22,6,40],"201":[6,42,6,46],"209":[6,1,6,47],"211":[6,1,6,21],"217":[6,1,6,48],"225":[7,1,7,9],"233":[7,25,7,28],"241":[7,1,7,29],"243":[7,1,7,24],"249":[7,1,7,30],"257":[1,1,7,30],"265":[1,1,7,30],"273":[1,1,7,30],"281":[1,1,7,30],"nBranches":0,"originalCodeFileName":"/tmp/runtimeAnalysis/index.js","instrumentedCodeFileName":"/tmp/runtimeAnalysis/index_jalangi_.js","code":"var myModule = require('./my-module');\n\nmyModule.doSomething({ hello: \"hello\" });\nmyModule.doSomething({hello: \"hello\"}, true);\nmyModule.doSomething({world: \"world\"});\nmyModule.doSomething({ world: \"world\" }, true);\nmyModule.doAnotherThing(123);"};
jalangiLabel0:
    while (true) {
        try {
            J$.Se(257, '/tmp/runtimeAnalysis/index_jalangi_.js', '/tmp/runtimeAnalysis/index.js');
            J$.N(265, 'myModule', myModule, 0);
            var myModule = J$.X1(41, J$.W(33, 'myModule', J$.F(25, J$.R(9, 'require', require, 2), 0)(J$.T(17, './my-module', 21, false)), myModule, 3));
            J$.X1(81, J$.M(73, J$.R(49, 'myModule', myModule, 1), 'doSomething', 0)(J$.T(65, {
                hello: J$.T(57, "hello", 21, false)
            }, 11, false)));
            J$.X1(129, J$.M(121, J$.R(89, 'myModule', myModule, 1), 'doSomething', 0)(J$.T(105, {
                hello: J$.T(97, "hello", 21, false)
            }, 11, false), J$.T(113, true, 23, false)));
            J$.X1(169, J$.M(161, J$.R(137, 'myModule', myModule, 1), 'doSomething', 0)(J$.T(153, {
                world: J$.T(145, "world", 21, false)
            }, 11, false)));
            J$.X1(217, J$.M(209, J$.R(177, 'myModule', myModule, 1), 'doSomething', 0)(J$.T(193, {
                world: J$.T(185, "world", 21, false)
            }, 11, false), J$.T(201, true, 23, false)));
            J$.X1(249, J$.M(241, J$.R(225, 'myModule', myModule, 1), 'doAnotherThing', 0)(J$.T(233, 123, 22, false)));
        } catch (J$e) {
            J$.Ex(273, J$e);
        } finally {
            if (J$.Sr(281)) {
                J$.L();
                continue jalangiLabel0;
            } else {
                J$.L();
                break jalangiLabel0;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
