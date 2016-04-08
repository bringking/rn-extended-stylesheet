// https://blog.formidable.com/unit-testing-react-native-with-mocha-and-enzyme-51518f13ba73#.wqlvkxofx

const React = require('react');
const RN = React;

RN.StyleSheet = {
    create( obj ) {
        return obj;
    }
};
RN.Dimensions = {
    get() {
        return { width: 500, height: 500 };
    }
};

module.exports = RN;