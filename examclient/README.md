webpack + typescript template project  

### npm script
[ dev server 실행 ]

```shell
# "webpack serve --mode development" 를 실행한다.
# "webpack serve --open ..... " 는 browser를 open 한다.
$ npm run dev
```
devServer 를 실행 시키면 빌드 결과물은 기본적으로 파일에는 없고 메모리상에 저장된다  

[ release build ]
```shell
$ npm run build
```

 
### webpack config 
[ devServer 설정 ]
```javascript
// webpack.config.js
module.exports = {
	// ...
    
    devServer: {
		// liveReloading 을 위해서 hot을 false(default true)로 해야함. 또는 watchFiles 지정
        // true 인경우, html 파일은 자동 reloading 안됨
		hot: false, 
        
        // SOP 문제 피하기 위해 proxy 설정 필요
        proxy: {
			'/api': 'http://localhost:11000'
        }
    }
	
	// ...
}
```
proxy 설정되면 위 경우 /api/users 를 호출하면 http://localhost:11000/api/users 로 routing 된다.  
