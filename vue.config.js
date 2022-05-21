module.exports = {
    pluginOptions: {
        electronBuilder: {
            preload: "src/preload.js",
            builderOptions: {
                "appId": "me.hypherionmc.simple-rpc-editor",
                "productName": "Simple RPC Editor",
                "copyright": "HypherionSA",
                "directories": {
                    "output": "out",
                },
				"publish": [
				{
					"provider": "github",
					"owner": "hypherionmc",
				    "repo": "simple-rpc-editor",
					"private": true,
					"releaseType": "draft"
				}
				],
                "dmg": {
                    "background": null,
                    "backgroundColor": "#ffffff",
                    "window": {
                        "width": "400",
                        "height": "300"
                    },
                    "contents": [
                        {
                            "x": 100,
                            "y": 100
                        },
                        {
                            "x": 300,
                            "y": 100,
                            "type": "link",
                            "path": "/Applications"
                        }
                    ]
                },
                "mac": {
                    "target": {
                        "target": 'default',
                        "arch": 'universal'
                    },
                    "category": "public.app-category.utilities"
                },
                "win": {
                    "target": [
                        {
                            target: "nsis"
                        },
                        {
                            target: "portable"
                        }
                    ]
                },
                "linux": {
                    "target": "AppImage",
                    "category": "Utility"
                }
            }
        }
    }
}
