let jsonFile = $file.read("assets/text.json")
let stringList = JSON.parse(jsonFile.string)
var textLabelStrIndex = 0

$ui.render({
    props: {
        id: "launchScreen",
        title: "宁静之地",
        navBarHidden: true,
        statusBarHidden: true
    },
    views: [
        {
            type: "label",
            props: {
                id: "titleLabel",
                text: `「宁静之地」`,
                font: $font("HiraKakuProN-W3", 30),
                align: $align.center
            },
            layout: function (make, view) {
                make.centerX.equalTo(view.super)
                make.centerY.equalTo(view.super.centerY).offset(-100)
            }
        },
        {
            type: "label",
            props: {
                // id: "",
                text: "源自：thequietplaceproject.com (closed)",
                font: $font("HiraKakuProN-W3", 10),
                align: $align.center
            },
            layout: function (make, view) {
                make.centerX.equalTo(view.super)
                make.bottom.equalTo(-20)
            }
        },
        {
            type: "label",
            props: {
                id: "subtextLabel",
                text: `请将手机调至勿扰模式
戴上耳机或处于安静环境中
点击屏幕进行交互`,
                lines: 0,
                font: $font(14),
                color: $color("gray"),
                align: $align.center
            },
            layout: function (make, view) {
                make.centerX.equalTo(view.super)
                make.top.equalTo($("titleLabel").bottom).offset(50)
            }
        },
        {
            type: "button",
            props: {
                title: "进入...",
                titleColor: $color("gray"),
                bgcolor: $color("#e3f2fd"),
                contentEdgeInsets: $insets(10, 10, 10, 10)
            },
            layout: function (make, view) {
                make.centerX.equalTo(view.super)
                make.centerY.equalTo($("subtextLabel").bottom).offset(100)
            },
            events: {
                tapped: function (sender) {
                    $ui.push({
                        props: {
                            id: "mainScreen",
                            navBarHidden: true,
                            statusBarHidden: true
                        }
                    });
                    nextText()
                    $audio.play({
                        path: "assets/audio.mp3"
                    });
                }
            }
        }
    ]
})

if ($system.volume < 0.1) {
    $("launchScreen").add({
        type: "label",
        props: {
            // id: newLabelId,
            text: `音量过小，请调高一点`,
            align: $align.center,
        },
        layout: function (make, view) {
            make.centerX.equalTo(view.super)
            make.centerY.equalTo($("subtextLabel").bottom).offset(20)
        }
    })
}

function nextText() {
    // 动画渐出本条文本
    // 移除本条文本view
    // if (sender) {
    //     $ui.animate({
    //         duration: 0.4,
    //         animation: function () {
    //             sender.alpha = 0
    //         },
    //         completion: function () {
    //             sender.remove()
    //         }
    //     })
    // }

    // 显示结束，关闭应用
    if (textLabelStrIndex == stringList.length) {
        $app.close();
    }
    // 动画渐入下一条
    let newLabelId = "titleLabel" + textLabelStrIndex.toString()

    let view = {
        type: "blur",
        layout: $layout.fill,
        props: {
            id: "blurView",
            bgcolor: $color("lightGray"),
            style: 1 // 0 ~ 5
        },
        views: [{
            type: "label",
            props: {
                id: newLabelId,
                text: stringList[textLabelStrIndex]["text"],
                font: $font(stringList[textLabelStrIndex]["font"]),
                lines: 0,
                align: $align.center,
                // bgcolor: $color("gray"),
                alpha: 0
            },
            layout: function (make, view) {
                make.center.equalTo(view.super)
                make.size.equalTo($size(250, 300))
            }
        }],
        events: {
            tapped: function (sender) {
                nextText(sender)
            },
            touchesBegan: function (sender, location) {
                sender.beganLocation = location
            },
            touchesEnded: function (sender, location) {
                if (location.x - sender.beganLocation.x > 150) {
                    $app.close();
                }
            }
        }
    }

    // 倒数计时时，禁止点击事件 与 渐入效果
    if (Number(stringList[textLabelStrIndex]["text"]) <= 30) {
        view.events.tapped = function(){}
        view.views[0].props.alpha = 1
    }

    $("mainScreen").add(view)
    $ui.animate({
        duration: 1,
        animation: function () {
            $ui.get(newLabelId).alpha = 1
        }
    })

    // 倒数计时
    if (Number(stringList[textLabelStrIndex]["text"]) <= 30) {
        var task = $delay(1.5, function () {
            nextText($(newLabelId));
        })
    }
    textLabelStrIndex = textLabelStrIndex + 1
}