import chai, {expect} from 'chai';
import dirtyChai from 'dirty-chai';
chai.use(dirtyChai);

import ExtendedStyleSheet, { matchMediaQuery, mergeSheetWithSize } from '../src/index';

describe('react-native-extended-stylesheet', () => {

    describe('should export', ()=> {

        it('matchMediaQuery', ()=> {
            expect(matchMediaQuery).to.exist();
        });

        it('mergeSheetWithSize', ()=> {
            expect(mergeSheetWithSize).to.exist();
        });

        it('a default', ()=> {
            expect(ExtendedStyleSheet).to.exist();
        });

    });

    describe('The default export', ()=> {

        it('should expose a method to create a stylesheet from an object', ()=> {
            expect(ExtendedStyleSheet.create).to.exist();
        });

    });

    describe('The "create" method', ()=> {

        it('should return a function for lazy evaluation', ()=> {
            expect(ExtendedStyleSheet.create()).to.be.a('function');
        });

        it('given an object with keys of objects, return an object with matching keys, with arrays', ()=> {
            let getSheet = ExtendedStyleSheet.create({
                container: {
                    width: 100
                },
                button: {
                    color: 'red'
                }
            });
            expect(Object.keys(getSheet()).length).to.equal(2);

            expect(getSheet().container).to.be.a('array');

            expect(getSheet().button).to.be.a('array');

            expect(getSheet().container[0]).to.eql({
                width: 100
            });

            expect(getSheet().button[0]).to.eql({
                color: 'red'
            });
        });

        it('given an object with keys of objects with media queries, it should mix the media queries at the end' +
        'of the respective arrays', ()=> {
            // Dimensions.get('window') mocked to {width:500,height:500}
            // See ./mocks/react_native.js
            let getSheet = ExtendedStyleSheet.create({
                container: {
                    width: 100,
                    '@media (min-width: 400)': {
                        width: 200
                    }
                },
                button: {
                    color: 'red',
                    '@media (min-width: 200)': {
                        color: 'blue'
                    },
                    '@media (max-width:600)': {
                        color: 'red'
                    }
                }
            });
            expect(getSheet().container.length).to.equal(2);

            expect(getSheet().container[1]).to.eql({
                width: 200
            });

            expect(getSheet().button.length).to.equal(3);

            expect(getSheet().button[1]).to.eql({
                color: 'blue'
            });

            expect(getSheet().button[2]).to.eql({
                color: 'red'
            });
        });

        it('given an object with keys of objects with media queries, ' +
        'if the media query doesn\'t match it won\'t be included', ()=> {
            // Dimensions.get('window') mocked to {width:500,height:500}
            // See ./mocks/react_native.js
            let getSheet = ExtendedStyleSheet.create({
                button: {
                    color: 'red',
                    '@media (min-width:200) and (max-width:500)': {
                        color: 'red'
                    },
                    '@media (min-width: 200)': {
                        color: 'yellow'
                    },
                    '@media (max-width:400)': {
                        color: 'blue'
                    }
                }
            });
            expect(getSheet().button.length).to.equal(3);

            expect(getSheet().button[1]).to.eql({
                color: 'red'
            });

            expect(getSheet().button[2]).to.eql({
                color: 'yellow'
            });
        });

        it('given an override object, it should add it last', ()=> {
            // Dimensions.get('window') mocked to {width:500,height:500}
            // See ./mocks/react_native.js
            let getSheet = ExtendedStyleSheet.create({
                button: {
                    color: 'red',
                    '@media (min-width: 200) and (max-width: 500)': {
                        color: 'red'
                    },
                    '@media (min-width: 200)': {
                        color: 'yellow'
                    },
                    '@media (max-width:400)': {
                        color: 'blue'
                    }
                }
            });
            const overiddenSheet = getSheet({
                button: {
                    color: 'black'
                }
            });

            expect(overiddenSheet.button.length).to.equal(4);

            expect(overiddenSheet.button[3]).to.eql({
                color: 'black'
            });

        });


    });
});