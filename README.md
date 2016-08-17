# rn-extended-stylesheet
An extended StyleSheet for React Native that supports Media Queries, caching and lazy overrides

[![Dependency Status](https://david-dm.org/bringking/rn-extended-stylesheet.svg)](https://david-dm.org/bringking/rn-extended-stylesheet)
[![peerDependency Status](https://david-dm.org/bringking/rn-extended-stylesheet/peer-status.svg)](https://david-dm.org/bringking/rn-extended-stylesheet#info=peerDependencies)
[![devDependency Status](https://david-dm.org/bringking/rn-extended-stylesheet/dev-status.svg)](https://david-dm.org/bringking/rn-extended-stylesheet#info=devDependencies)
[![build status](https://travis-ci.org/bringking/rn-extended-stylesheet.svg?branch=master)](https://travis-ci.org/bringking/rn-extended-stylesheet)


#Installation

`npm install rn-extended-stylesheet`

# Usage

`ExtendedStyleSheet` allows you to specify a set of styles with inline Media Queries. `rn-extended-stylesheet`
will return a function for you to call during the render cycle that will evaluate the current dimensions of the window
using `Dimensions.get('window')`. The library will cache the base styles that aren't dependent on the size, so you 
are not constantly re-creating the bridged StyleSheet (as mentioned in the React native docs) [here](https://facebook.github.io/react-native/docs/stylesheet.html#content).

```js
import ExtendedStyleSheet from 'rn-extended-stylesheet';

const getSheet = ExtendedStyleSheet.create({
    button: {
        color: "red",
        "@media (min-width:200) and (max-width:500)": {
            color: 'red'
        },
        "@media (min-width: 200)": {
            color: 'yellow'
        },
        "@media (max-width:400)": {
            color: 'blue'
        }
    }          
});

class Button extends Component {
    render() {
        const styles = getSheet();
        return <Button style={styles.button}></Button>
    }
}

```

# Advanced Usage

The returned function from `create` allows you to pass an override object to pass styling keys that you might not know
at creation time (like overrides from props). These overrides are added as the last item to the style set, so they take 
precedence.

```js
import ExtendedStyleSheet from 'rn-extended-stylesheet';

const getSheet = ExtendedStyleSheet.create({
    button: {
        color: "red",
        "@media (min-width:200) and (max-width:500)": {
            color: 'red'
        },
        "@media (min-width: 200)": {
            color: 'yellow'
        },
        "@media (max-width:400)": {
            color: 'blue'
        }
    }          
});

class Button extends Component {
    render() {
        const {buttonStyle} = this.props; // get button overrides from props
        const styles = getSheet({button:buttonStyle}); // mix into the stylesheet
        
        return <Button style={styles.button}></Button>
    }
}

```
