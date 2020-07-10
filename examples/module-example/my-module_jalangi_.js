J$.iids = {"8":[3,7,3,19],"9":[1,1,1,7],"16":[6,8,6,15],"17":[3,7,3,8],"24":[3,7,3,19],"25":[3,12,3,13],"33":[3,12,3,19],"41":[4,11,4,12],"49":[4,11,4,18],"57":[4,11,4,18],"65":[4,4,4,19],"73":[6,8,6,9],"81":[6,8,6,15],"89":[7,12,7,13],"97":[7,12,7,19],"105":[7,12,7,19],"113":[7,5,7,20],"121":[2,15,10,3],"129":[2,15,10,3],"137":[2,15,10,3],"145":[2,15,10,3],"153":[2,15,10,3],"161":[12,10,12,11],"169":[12,10,12,11],"177":[12,3,12,12],"185":[11,18,13,3],"193":[11,18,13,3],"201":[11,18,13,3],"209":[11,18,13,3],"217":[1,18,14,2],"225":[1,1,14,2],"233":[1,1,14,3],"241":[1,1,14,3],"249":[6,4,8,5],"257":[3,3,9,4],"265":[2,15,10,3],"273":[2,15,10,3],"281":[11,18,13,3],"289":[11,18,13,3],"297":[1,1,14,3],"305":[1,1,14,3],"nBranches":6,"originalCodeFileName":"/tmp/runtimeAnalysis/my-module.js","instrumentedCodeFileName":"/tmp/runtimeAnalysis/my-module_jalangi_.js","code":"module.exports = {\n\tdoSomething: function(a, c) {\n\t\tif (c && a.hello) {\n\t\t\treturn a.hello;\n\t\t} else {\n\t\t\tif (a.world) {\n\t\t\t\treturn a.world;\n\t\t\t}\n\t\t}\n\t},\n\tdoAnotherThing: function(a) {\n\t\treturn a;\n\t}\n};"};
jalangiLabel3:
    while (true) {
        try {
            J$.Se(241, '/tmp/runtimeAnalysis/my-module_jalangi_.js', '/tmp/runtimeAnalysis/my-module.js');
            J$.X1(233, J$.P(225, J$.R(9, 'module', module, 2), 'exports', J$.T(217, {
                doSomething: J$.T(153, function (a, c) {
                    jalangiLabel1:
                        while (true) {
                            try {
                                J$.Fe(121, arguments.callee, this, arguments);
                                arguments = J$.N(129, 'arguments', arguments, 4);
                                a = J$.N(137, 'a', a, 4);
                                c = J$.N(145, 'c', c, 4);
                                if (J$.X1(257, J$.C(24, J$.C(8, J$.R(17, 'c', c, 0)) ? J$.G(33, J$.R(25, 'a', a, 0), 'hello', 0) : J$._()))) {
                                    return J$.X1(65, J$.Rt(57, J$.G(49, J$.R(41, 'a', a, 0), 'hello', 0)));
                                } else {
                                    if (J$.X1(249, J$.C(16, J$.G(81, J$.R(73, 'a', a, 0), 'world', 0)))) {
                                        return J$.X1(113, J$.Rt(105, J$.G(97, J$.R(89, 'a', a, 0), 'world', 0)));
                                    }
                                }
                            } catch (J$e) {
                                J$.Ex(265, J$e);
                            } finally {
                                if (J$.Fr(273))
                                    continue jalangiLabel1;
                                else
                                    return J$.Ra();
                            }
                        }
                }, 12, false, 121),
                doAnotherThing: J$.T(209, function (a) {
                    jalangiLabel2:
                        while (true) {
                            try {
                                J$.Fe(185, arguments.callee, this, arguments);
                                arguments = J$.N(193, 'arguments', arguments, 4);
                                a = J$.N(201, 'a', a, 4);
                                return J$.X1(177, J$.Rt(169, J$.R(161, 'a', a, 0)));
                            } catch (J$e) {
                                J$.Ex(281, J$e);
                            } finally {
                                if (J$.Fr(289))
                                    continue jalangiLabel2;
                                else
                                    return J$.Ra();
                            }
                        }
                }, 12, false, 185)
            }, 11, false), 0));
        } catch (J$e) {
            J$.Ex(297, J$e);
        } finally {
            if (J$.Sr(305)) {
                J$.L();
                continue jalangiLabel3;
            } else {
                J$.L();
                break jalangiLabel3;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
