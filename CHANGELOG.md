# Change Log

All notable changes to the "nuxtcomponentpopdoc" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0 Release]

- Bugfix: If component has props or the rest of the component block continues on another line, the pop doc will now show. <br> <br>
    ```html
    <!-- Now Works -->
    <MyComponent 
    v-model="data"
    prop="propValue"
    />
    ``` 
- Support for `<kebab-case-component></kebab-case-component>`
