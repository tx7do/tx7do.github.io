# Qt6 QML 实现DateTimePicker组件

## 实现代码

```qmllang
// DateTimePicker.qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Popup {
    id: dateTimePicker

    width: 650
    height: 480

    modal: true
    closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside
    padding: 0
    focus: true

    readonly property color colorBackground: "#2b2b2b"
    readonly property color colorSurface: "#1e1e1e"
    readonly property color colorSurfaceVariant: "#222"
    readonly property color colorBorder: "#444"
    readonly property color colorBorderLight: "#555"

    readonly property color colorPrimary: "#007AFF"
    readonly property color colorPrimaryHover: "#0066CC"

    readonly property color colorTextPrimary: "white"
    readonly property color colorTextSecondary: "#aaa"
    readonly property color colorTextTertiary: "#888"
    readonly property color colorTextDisabled: "#444"

    readonly property color colorHover: "#333"
    readonly property color colorHoverLight: "#444"
    readonly property color colorHoverDark: "#555"

    readonly property color colorScrollbar: "#555"
    readonly property color colorScrollbarHover: "#666"
    readonly property color colorScrollbarPressed: "#888"

    readonly property color colorDisabled: "#555"

    property string dateTime: Qt.formatDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")
    property string dateFormat: "yyyy-MM-dd"
    property string timeFormat: "hh:mm:ss"
    property string minDateTime: ""
    property string maxDateTime: ""

    property date selectedDate: new Date()
    property int selectedHour: 0
    property int selectedMinute: 0
    property int selectedSecond: 0

    property int currentYear: new Date().getFullYear()
    property int currentMonth: new Date().getMonth()

    property bool hasSelection: false  // 选择状态标记

    // 焦点区域属性
    property int focusArea: 0  // 0: 日期, 1: 时, 2: 分, 3: 秒
    property int focusedDateIndex: 0  // 日历格子索引

    signal confirmed(date datetime)

    background: Rectangle {
        color: dateTimePicker.colorBackground
        radius: 8

        FocusScope {
            id: keyboardHandler
            anchors.fill: parent
            focus: true

            Keys.onPressed: function (event) {
                if (event.key === Qt.Key_Left) {
                    if (dateTimePicker.focusArea === 0) {
                        dateTimePicker.focusedDateIndex = Math.max(0, dateTimePicker.focusedDateIndex - 1)
                        dateTimePicker.selectedDate = getDateForCell(dateTimePicker.focusedDateIndex)
                        dateTimePicker.hasSelection = true
                    } else if (dateTimePicker.focusArea > 0) {
                        dateTimePicker.focusArea = Math.max(0, dateTimePicker.focusArea - 1)
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Right) {
                    if (dateTimePicker.focusArea === 0) {
                        dateTimePicker.focusedDateIndex = Math.min(41, dateTimePicker.focusedDateIndex + 1)
                        dateTimePicker.selectedDate = getDateForCell(dateTimePicker.focusedDateIndex)
                        dateTimePicker.hasSelection = true
                    } else if (dateTimePicker.focusArea < 3) {
                        dateTimePicker.focusArea = Math.min(3, dateTimePicker.focusArea + 1)
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Up) {
                    if (dateTimePicker.focusArea === 0) {
                        dateTimePicker.focusedDateIndex = Math.max(0, dateTimePicker.focusedDateIndex - 7)
                        dateTimePicker.selectedDate = getDateForCell(dateTimePicker.focusedDateIndex)
                        dateTimePicker.hasSelection = true
                    } else {
                        if (dateTimePicker.focusArea === 1) {
                            dateTimePicker.selectedHour = (dateTimePicker.selectedHour - 1 + 24) % 24
                        } else if (dateTimePicker.focusArea === 2) {
                            dateTimePicker.selectedMinute = (dateTimePicker.selectedMinute - 1 + 60) % 60
                        } else {
                            dateTimePicker.selectedSecond = (dateTimePicker.selectedSecond - 1 + 60) % 60
                        }
                        dateTimePicker.hasSelection = true
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Down) {
                    if (dateTimePicker.focusArea === 0) {
                        dateTimePicker.focusedDateIndex = Math.min(41, dateTimePicker.focusedDateIndex + 7)
                        dateTimePicker.selectedDate = getDateForCell(dateTimePicker.focusedDateIndex)
                        dateTimePicker.hasSelection = true
                    } else {
                        if (dateTimePicker.focusArea === 1) {
                            dateTimePicker.selectedHour = (dateTimePicker.selectedHour + 1) % 24
                        } else if (dateTimePicker.focusArea === 2) {
                            dateTimePicker.selectedMinute = (dateTimePicker.selectedMinute + 1) % 60
                        } else {
                            dateTimePicker.selectedSecond = (dateTimePicker.selectedSecond + 1) % 60
                        }
                        dateTimePicker.hasSelection = true
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Tab) {
                    dateTimePicker.focusArea = (dateTimePicker.focusArea + 1) % 4
                    event.accepted = true
                } else if (event.key === Qt.Key_Backtab) {
                    dateTimePicker.focusArea = (dateTimePicker.focusArea - 1 + 4) % 4
                    event.accepted = true
                } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                    if (dateTimePicker.hasSelection) {
                        let dt = new Date(dateTimePicker.selectedDate)
                        dt.setHours(dateTimePicker.selectedHour)
                        dt.setMinutes(dateTimePicker.selectedMinute)
                        dt.setSeconds(dateTimePicker.selectedSecond)
                        dateTimePicker.confirmed(dt)
                        dateTimePicker.close()
                    }
                    event.accepted = true
                } else if (event.key === Qt.Key_Escape) {
                    dateTimePicker.close()
                    event.accepted = true
                }
            }
        }
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        // 顶部日期时间显示
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 50
            color: dateTimePicker.colorSurface
            radius: 8

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: 8
                color: parent.color
            }

            Label {
                id: dateTimeLabel

                anchors.centerIn: parent
                color: dateTimePicker.colorPrimary
                font.pixelSize: 16
                font.bold: true
                text: Qt.formatDateTime(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedHour, selectedMinute, selectedSecond), dateFormat + " " + timeFormat)
            }
        }

        // 主内容区域
        RowLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.margins: 20
            spacing: 20

            // 左侧日历区域
            ColumnLayout {
                Layout.fillWidth: true
                Layout.fillHeight: true
                spacing: 12

                // 月份导航栏
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 8

                    Button {
                        text: "<<"
                        Layout.preferredWidth: 40
                        Layout.preferredHeight: 32
                        onClicked: {
                            currentYear -= 1
                        }
                        background: Rectangle {
                            color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder
                            radius: 4
                        }
                        contentItem: Text {
                            text: parent.text
                            color: dateTimePicker.colorTextPrimary
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                        }
                    }
                    Button {
                        text: "<"
                        Layout.preferredWidth: 40
                        Layout.preferredHeight: 32
                        onClicked: {
                            currentMonth -= 1
                            if (currentMonth < 0) {
                                currentMonth = 11
                                currentYear -= 1
                            }
                        }
                        background: Rectangle {
                            color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder
                            radius: 4
                        }
                        contentItem: Text {
                            text: parent.text
                            color: dateTimePicker.colorTextPrimary
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                        }
                    }
                    Label {
                        text: Qt.formatDate(new Date(currentYear, currentMonth), "yyyy年 M月")
                        color: dateTimePicker.colorTextPrimary
                        font.pixelSize: 16
                        font.bold: true
                        Layout.fillWidth: true
                        horizontalAlignment: Text.AlignHCenter
                    }
                    Button {
                        text: ">"
                        Layout.preferredWidth: 40
                        Layout.preferredHeight: 32
                        onClicked: {
                            currentMonth += 1
                            if (currentMonth > 11) {
                                currentMonth = 0
                                currentYear += 1
                            }
                        }
                        background: Rectangle {
                            color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder
                            radius: 4
                        }
                        contentItem: Text {
                            text: parent.text
                            color: dateTimePicker.colorTextPrimary
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                        }
                    }
                    Button {
                        text: ">>"
                        Layout.preferredWidth: 40
                        Layout.preferredHeight: 32
                        onClicked: {
                            currentYear += 1
                        }
                        background: Rectangle {
                            color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder
                            radius: 4
                        }
                        contentItem: Text {
                            text: parent.text
                            color: dateTimePicker.colorTextPrimary
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                        }
                    }
                }

                // 星期标题行
                GridLayout {
                    Layout.fillWidth: true
                    columns: 7
                    rowSpacing: 0
                    columnSpacing: 0

                    Repeater {
                        model: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
                        Label {
                            text: modelData
                            color: dateTimePicker.colorTextTertiary
                            font.pixelSize: 12
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                            Layout.fillWidth: true
                            Layout.preferredHeight: 30
                        }
                    }
                }

                // 日期网格
                GridLayout {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    columns: 7
                    rowSpacing: 8
                    columnSpacing: 8

                    Repeater {
                        model: 42
                        Rectangle {
                            Layout.fillWidth: true
                            Layout.fillHeight: true
                            Layout.minimumHeight: 40
                            radius: 4

                            color: {
                                if (!isInRange) return dateTimePicker.colorSurfaceVariant

                                let date = getDateForCell(index)
                                if (date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear()) {
                                    return dateTimePicker.colorPrimary
                                }
                                return dateMouseArea.containsMouse ? dateTimePicker.colorBorder : "transparent"
                            }

                            border.color: {
                                let date = cellDate
                                if (date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear()) {
                                    return "white"
                                }
                                return "transparent"
                            }
                            border.width: 2

                            property var cellDate: getDateForCell(index)

                            property bool isInRange: {
                                let testDate = new Date(cellDate)
                                testDate.setHours(selectedHour, selectedMinute, selectedSecond)
                                return isDateTimeInRange(testDate)
                            }

                            Label {
                                anchors.centerIn: parent
                                text: parent.cellDate.getDate()
                                color: {
                                    if (!parent.isInRange) return dateTimePicker.colorTextDisabled
                                    return parent.cellDate.getMonth() === currentMonth ? dateTimePicker.colorTextPrimary : dateTimePicker.colorBorderLight
                                }
                                font.pixelSize: 14
                            }

                            MouseArea {
                                id: dateMouseArea
                                anchors.fill: parent
                                hoverEnabled: true
                                enabled: parent.isInRange
                                cursorShape: enabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                                onClicked: {
                                    if (parent.isInRange) {
                                        let clickedDate = parent.cellDate
                                        selectedDate = clickedDate

                                        // 如果点击的日期不在当前月,自动切换到该月
                                        if (clickedDate.getMonth() !== currentMonth || clickedDate.getFullYear() !== currentYear) {
                                            currentMonth = clickedDate.getMonth()
                                            currentYear = clickedDate.getFullYear()
                                        }

                                        dateTimePicker.hasSelection = true
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 分隔线
            Rectangle {
                Layout.preferredWidth: 1
                Layout.fillHeight: true
                color: dateTimePicker.colorBorder
            }

            // 右侧时间选择区域
            RowLayout {
                Layout.preferredWidth: 210
                Layout.fillHeight: true
                spacing: 8

                // 时间列组件
                Repeater {
                    model: [{label: "时", value: selectedHour, max: 24}, {
                        label: "分", value: selectedMinute, max: 60
                    }, {label: "秒", value: selectedSecond, max: 60}]

                    ColumnLayout {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        spacing: 8

                        property string timeLabel: modelData.label

                        Label {
                            text: timeLabel
                            color: dateTimePicker.colorTextTertiary
                            font.pixelSize: 12
                            Layout.alignment: Qt.AlignHCenter
                        }

                        Rectangle {
                            Layout.fillWidth: true
                            Layout.fillHeight: true
                            color: dateTimePicker.colorSurface
                            radius: 4
                            border.color: dateTimePicker.colorBorder
                            border.width: 1

                            ScrollView {
                                anchors.fill: parent
                                anchors.margins: 2
                                clip: true
                                ScrollBar.horizontal.policy: ScrollBar.AlwaysOff

                                ScrollBar.vertical: ScrollBar {
                                    policy: ScrollBar.AsNeeded
                                    width: 8

                                    contentItem: Rectangle {
                                        implicitWidth: 8
                                        radius: 4
                                        color: parent.pressed ? dateTimePicker.colorScrollbarPressed : (parent.hovered ? dateTimePicker.colorScrollbarHover : dateTimePicker.colorScrollbar)
                                    }

                                    background: Rectangle {
                                        implicitWidth: 6
                                        color: "transparent"
                                    }
                                }

                                ListView {
                                    id: timeListView

                                    model: modelData.max
                                    highlightFollowsCurrentItem: false
                                    highlightMoveDuration: 0
                                    snapMode: ListView.SnapToItem

                                    readonly property string timeType: timeLabel

                                    readonly property int currentValue: {
                                        if (timeType === "时") return dateTimePicker.selectedHour
                                        if (timeType === "分") return dateTimePicker.selectedMinute
                                        return dateTimePicker.selectedSecond
                                    }

                                    function selectTime(value) {
                                        console.log("Selected " + timeListView.timeType + ": " + value + ", hasSelection: " + dateTimePicker.hasSelection)

                                        dateTimePicker.hasSelection = true

                                        if (timeType === "时") {
                                            dateTimePicker.selectedHour = value
                                        } else if (timeType === "分") {
                                            dateTimePicker.selectedMinute = value
                                        } else {
                                            dateTimePicker.selectedSecond = value
                                        }

                                        // 滚动到列表顶部
                                        positionViewAtIndex(value, ListView.Beginning)
                                    }

                                    delegate: Rectangle {
                                        width: timeListView.width
                                        height: 44
                                        radius: 4

                                        color: {
                                            if (index === timeListView.currentValue) return dateTimePicker.colorPrimary
                                            return timeItemMouseArea.containsMouse ? dateTimePicker.colorHover : "transparent"
                                        }

                                        Label {
                                            anchors.centerIn: parent
                                            text: index.toString().padStart(2, '0')
                                            color: index === timeListView.currentValue ? dateTimePicker.colorTextPrimary : dateTimePicker.colorTextSecondary
                                            font.pixelSize: 16
                                            font.bold: index === timeListView.currentValue
                                        }

                                        MouseArea {
                                            id: timeItemMouseArea
                                            anchors.fill: parent
                                            hoverEnabled: true
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                timeListView.selectTime(index)
                                            }
                                        }
                                    }

                                    Component.onCompleted: {
                                        positionViewAtIndex(modelData.value, ListView.Beginning)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // 底部按钮区域
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 60
            color: dateTimePicker.colorSurface

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 8
                color: parent.color
            }

            RowLayout {
                anchors.fill: parent
                anchors.margins: 15
                spacing: 10

                Button {
                    text: qsTr("今天")
                    Layout.preferredWidth: 80
                    Layout.preferredHeight: 36
                    onClicked: {
                        var now = new Date()
                        selectedDate = now
                        selectedHour = now.getHours()
                        selectedMinute = now.getMinutes()
                        selectedSecond = now.getSeconds()
                        currentYear = now.getFullYear()
                        currentMonth = now.getMonth()
                        hasSelection = true
                    }
                    background: Rectangle {
                        color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder
                        radius: 4
                        border.color: dateTimePicker.colorBorderLight
                        border.width: 1
                    }
                    contentItem: Text {
                        text: parent.text
                        color: dateTimePicker.colorTextSecondary
                        font.pixelSize: 14
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                }

                Item {
                    Layout.fillWidth: true
                }

                Button {
                    text: qsTr("取消")
                    Layout.preferredWidth: 80
                    Layout.preferredHeight: 36
                    onClicked: dateTimePicker.close()
                    background: Rectangle {
                        color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder
                        radius: 4
                        border.color: dateTimePicker.colorBorderLight
                        border.width: 1
                    }
                    contentItem: Text {
                        text: parent.text
                        color: dateTimePicker.colorTextSecondary
                        font.pixelSize: 14
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                }

                Button {
                    text: qsTr("确定")
                    Layout.preferredWidth: 80
                    Layout.preferredHeight: 36
                    enabled: dateTimePicker.hasSelection
                    onClicked: {
                        let dt = new Date(selectedDate)
                        dt.setHours(selectedHour)
                        dt.setMinutes(selectedMinute)
                        dt.setSeconds(selectedSecond)

                        if (isDateTimeInRange(dt)) {
                            dateTimePicker.dateTime = formatDateTime(dt)
                            confirmed(dt)
                            close()
                        }
                    }
                    background: Rectangle {
                        color: {
                            if (!parent.enabled) return dateTimePicker.colorDisabled
                            return parent.hovered ? dateTimePicker.colorPrimaryHover : dateTimePicker.colorPrimary
                        }
                        radius: 4
                    }
                    contentItem: Text {
                        text: parent.text
                        color: parent.enabled ? dateTimePicker.colorTextPrimary : dateTimePicker.colorTextTertiary
                        font.pixelSize: 14
                        font.bold: true
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }
                }
            }
        }
    }

    function getDateForCell(index) {
        let firstDay = new Date(currentYear, currentMonth, 1)
        let dayOfWeek = (firstDay.getDay() + 6) % 7
        let cellDate = new Date(currentYear, currentMonth, 1 - dayOfWeek + index)
        return cellDate
    }

    function isDateTimeInRange(date) {
        if (minDateTime) {
            let minDt = new Date(minDateTime)
            if (!isNaN(minDt.getTime()) && date < minDt) {
                return false
            }
        }
        if (maxDateTime) {
            let maxDt = new Date(maxDateTime)
            if (!isNaN(maxDt.getTime()) && date > maxDt) {
                return false
            }
        }
        return true
    }

    function formatDateTime(date) {
        return Qt.formatDateTime(date, dateFormat + " " + timeFormat)
    }

    onDateTimeChanged: {
        if (!hasSelection) {
            let dt = new Date(dateTime)
            if (!isNaN(dt.getTime())) {
                selectedDate = dt
                selectedHour = dt.getHours()
                selectedMinute = dt.getMinutes()
                selectedSecond = dt.getSeconds()
                currentYear = dt.getFullYear()
                currentMonth = dt.getMonth()
            }
        }
    }

    Component.onCompleted: {
        if (dateTime) {
            let dt = new Date(dateTime)
            if (!isNaN(dt.getTime())) {
                selectedDate = dt
                selectedHour = dt.getHours()
                selectedMinute = dt.getMinutes()
                selectedSecond = dt.getSeconds()
                currentYear = dt.getFullYear()
                currentMonth = dt.getMonth()

                hasSelection = true
            }
        }

        // 初始化焦点位置
        let firstDay = new Date(currentYear, currentMonth, 1)
        let dayOfWeek = (firstDay.getDay() + 6) % 7
        focusedDateIndex = dayOfWeek + selectedDate.getDate() - 1

        // 延迟设置焦点,确保 FocusScope 已完全初始化
        Qt.callLater(function () {
            keyboardHandler.forceActiveFocus()
        })
    }
}
```

## 使用代码

```qmllang
DateTimePicker {
    id: dateTimePicker

    width: 250
    height: 40

    // 初始值为当前日期时间
    dateTime: Qt.formatDateTime(new Date(), "yyyy-MM-dd hh:mm:ss")

    // 日期格式
    dateFormat: "yyyy-MM-dd"
    // 时间格式
    timeFormat: "hh:mm:ss"

    // 最小可选日期时间
    minDateTime: "2023-01-01 00:00:00"
    // 最大可选日期时间
    maxDateTime: "2024-12-31 23:59:59"

    onConfirmed: function (datetime) {
        startDateField.text = Qt.formatDateTime(datetime, "yyyy-MM-dd HH:mm")
    }
}
```

显示效果：

![后台用户登录界面](/assets/images/qt/DateTimePicker.png)