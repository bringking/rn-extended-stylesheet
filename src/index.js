import {
Dimensions,
StyleSheet
} from 'react-native';
import pick from 'lodash.pick';
import mediaQuery from 'css-mediaquery';

/**
 * Match a media query against a size object (Typically received from Dimensions.get());
 * @param size {object} The size object to match against the media query.
 * @param mq {string} The media query to validate
 * @returns {boolean}
 */
export const matchMediaQuery = ( size, mq ) => {
    // parse the query
    const ast = mediaQuery.parse(mq);
    let min = true;
    let max = true;

    if ( ast.length && ast[0].expressions.length ) {
        // find the min
        ast[0].expressions.forEach(( match ) => {

            if ( match.modifier && match.value ) {

                let parsedVal = parseInt(match.value.replace('pt', '').replace('px', ''), 10);
                // TODO only supporting width at the current moment
                if ( match.modifier === 'min' ) {
                    min = size.width >= parsedVal;
                }

                if ( match.modifier === 'max' ) {
                    max = size.width <= parsedVal;
                }

            }

        });
    }

    return min && max;
};

/**
 * Given a size, merge a base stylesheet with a media-specific styles and a final override object
 * @param size {object} The size of the window {width,height}
 * @param baseSheet {object} The base style sheet to start with
 * @param mediaSpecific {object} Any media specific styles to override the base
 * @param rest {object} A final style to override the media specific styles
 * @returns {object}
 */
export const mergeSheetWithSize = ( size, baseSheet = {}, mediaSpecific = {}, rest = {} ) => {
    let result = {};

    // for each style in the base sheet, create an array result to merge the rest
    // of the styles
    Object.keys(baseSheet).forEach(( k ) => {
        result[k] = [baseSheet[k]];
    });


    // for each media specific that matches the current size, add to the current styles
    Object.keys(mediaSpecific).forEach(( k ) => {

        // add to the result if not present
        if ( !result[k] ) {
            result[k] = [];
        }

        // get each query
        const matchingStyles = Object.keys(mediaSpecific[k])
        .filter(( mq ) => matchMediaQuery(size, mq))
        .map(( mq )=>mediaSpecific[k][mq]);

        // add the style to the set
        result[k].push(...matchingStyles);
    });

    // merge the rest
    let restKeys = Object.keys(rest);

    if ( restKeys.length ) {
        restKeys.forEach(( k ) => {
            // add to the result if not present
            if ( !result[k] ) {
                result[k] = [];
            }
            // add the item
            result[k].push(rest[k]);
        });
    }

    return result;

};
/**
 * The ExtendedStyleSheet object
 * @type {{create: (function(*=): Function)}}
 */
const ExtendedStyleSheet = {
    /**
     * Create a StyleSheet from an object containing React Native Styles.
     * The stylesheet can also include Media Queries to match a set of styles
     * against the current window size
     * @param baseStyleSheet {object} The styles to create a sheet from
     * @returns {Function} A function to evaluate at render time. This function will merge
     * any window specific styles or overrides with the base stylesheet to give you the final StyleSheet
     */
    create( baseStyleSheet = {} ) {
        // get keys
        let styleKeys = Object.keys(baseStyleSheet);

        // extract media specific styles
        let mediaSpecificValues = styleKeys.reduce(( memo, key ) => {
            let styleObject = baseStyleSheet[key];
            let styleObjectMediaQueries = pick(styleObject, ( val, key ) =>key.startsWith('@media'));
            memo[key] = styleObjectMediaQueries;
            return memo;
        }, {});

        // extract the base styles that aren't dependent on screen size
        let constantValues = styleKeys.reduce(( memo, key ) => {
            let styleObject = baseStyleSheet[key];
            memo[key] = pick(styleObject, ( val, key ) => !key.startsWith('@media'));
            return memo;
        }, {});


        // create the base sheet
        let baseSheet = StyleSheet.create(constantValues);
        let lastSize = Dimensions.get('window');
        let merged = mergeSheetWithSize(lastSize, baseSheet, mediaSpecificValues);

        // cache the base styles
        return ( other ) => {
            // compare the current window size
            let currentSize = Dimensions.get('window');
            if ( other || currentSize.width !== lastSize.width || currentSize.height !== lastSize.height ) {
                lastSize = currentSize;
                return mergeSheetWithSize(lastSize, baseSheet, mediaSpecificValues, other);
            }
            // no overrides specified or the window size hasn't changed, so return the cached merged
            return merged;
        };
    }
};

export default ExtendedStyleSheet;