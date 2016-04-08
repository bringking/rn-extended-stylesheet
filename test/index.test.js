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
});