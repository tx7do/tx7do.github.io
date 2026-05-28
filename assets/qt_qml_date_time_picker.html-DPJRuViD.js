import{_ as s,c as e,e as a,o as i}from"./app-B5F8D5Zr.js";const l="/assets/images/qt/DateTimePicker.png",d={};function c(r,n){return i(),e("div",null,[...n[0]||(n[0]=[a(`<h1 id="qt6-qml-自定义-datetimepicker-组件-完整实现与使用指南" tabindex="-1"><a class="header-anchor" href="#qt6-qml-自定义-datetimepicker-组件-完整实现与使用指南"><span>Qt6 QML 自定义 DateTimePicker 组件：完整实现与使用指南</span></a></h1><p>在 Qt 开发中，原生的日期时间选择组件往往难以满足个性化的 UI 设计和交互需求（如深色主题、自定义时间范围、键盘导航等）。本文基于 Qt6.10 版本，从零实现一款功能完整、交互友好的 DateTimePicker 组件，支持日期 + 时间联动选择、时间范围限制、键盘 / 鼠标双交互、深色主题适配等特性，可直接集成到 QML 项目中。</p><h2 id="一、组件核心特性" tabindex="-1"><a class="header-anchor" href="#一、组件核心特性"><span>一、组件核心特性</span></a></h2><table><thead><tr><th>特性</th><th>说明</th></tr></thead><tbody><tr><td>深色主题适配</td><td>内置统一的深色系样式常量，支持快速切换主题</td></tr><tr><td>完整时间维度选择</td><td>支持年、月、日、时、分、秒全维度选择，日历网格可视化展示</td></tr><tr><td>时间范围限制</td><td>通过 <code>minDateTime</code>/<code>maxDateTime</code> 限制可选时间范围，禁用超出范围的选项</td></tr><tr><td>双交互模式</td><td>支持鼠标点击 / 悬停、键盘方向键 / Tab/Enter/Escape 操作</td></tr><tr><td>智能视觉反馈</td><td>选中状态高亮、禁用状态灰显、悬停效果、焦点区域提示</td></tr><tr><td>快捷操作</td><td>内置「今天」快捷按钮，一键恢复当前系统时间</td></tr><tr><td>自动月份切换</td><td>点击非当前月日期时，自动切换到对应月份</td></tr></tbody></table><h2 id="二、完整实现代码" tabindex="-1"><a class="header-anchor" href="#二、完整实现代码"><span>二、完整实现代码</span></a></h2><p>组件以 <code>Popup</code> 为容器，通过布局嵌套实现日历区域、时间选择区域、操作按钮区域的分离，核心逻辑包括日期计算、范围校验、交互响应三部分。</p><div class="language-qmllang line-numbers-mode" data-highlighter="prismjs" data-ext="qmllang"><pre><code><span class="line">// DateTimePicker.qml</span>
<span class="line">import QtQuick</span>
<span class="line">import QtQuick.Controls</span>
<span class="line">import QtQuick.Layouts</span>
<span class="line"></span>
<span class="line">Popup {</span>
<span class="line">    id: dateTimePicker</span>
<span class="line"></span>
<span class="line">    width: 650</span>
<span class="line">    height: 480</span>
<span class="line"></span>
<span class="line">    modal: true</span>
<span class="line">    closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside</span>
<span class="line">    padding: 0</span>
<span class="line">    focus: true</span>
<span class="line"></span>
<span class="line">    readonly property color colorBackground: &quot;#2b2b2b&quot;</span>
<span class="line">    readonly property color colorSurface: &quot;#1e1e1e&quot;</span>
<span class="line">    readonly property color colorSurfaceVariant: &quot;#222&quot;</span>
<span class="line">    readonly property color colorBorder: &quot;#444&quot;</span>
<span class="line">    readonly property color colorBorderLight: &quot;#555&quot;</span>
<span class="line"></span>
<span class="line">    readonly property color colorPrimary: &quot;#007AFF&quot;</span>
<span class="line">    readonly property color colorPrimaryHover: &quot;#0066CC&quot;</span>
<span class="line"></span>
<span class="line">    readonly property color colorTextPrimary: &quot;white&quot;</span>
<span class="line">    readonly property color colorTextSecondary: &quot;#aaa&quot;</span>
<span class="line">    readonly property color colorTextTertiary: &quot;#888&quot;</span>
<span class="line">    readonly property color colorTextDisabled: &quot;#444&quot;</span>
<span class="line"></span>
<span class="line">    readonly property color colorHover: &quot;#333&quot;</span>
<span class="line">    readonly property color colorHoverLight: &quot;#444&quot;</span>
<span class="line">    readonly property color colorHoverDark: &quot;#555&quot;</span>
<span class="line"></span>
<span class="line">    readonly property color colorScrollbar: &quot;#555&quot;</span>
<span class="line">    readonly property color colorScrollbarHover: &quot;#666&quot;</span>
<span class="line">    readonly property color colorScrollbarPressed: &quot;#888&quot;</span>
<span class="line"></span>
<span class="line">    readonly property color colorDisabled: &quot;#555&quot;</span>
<span class="line"></span>
<span class="line">    property string dateTime: Qt.formatDateTime(new Date(), &quot;yyyy-MM-dd hh:mm:ss&quot;)</span>
<span class="line">    property string dateFormat: &quot;yyyy-MM-dd&quot;</span>
<span class="line">    property string timeFormat: &quot;hh:mm:ss&quot;</span>
<span class="line">    property string minDateTime: &quot;&quot;</span>
<span class="line">    property string maxDateTime: &quot;&quot;</span>
<span class="line"></span>
<span class="line">    property date selectedDate: new Date()</span>
<span class="line">    property int selectedHour: 0</span>
<span class="line">    property int selectedMinute: 0</span>
<span class="line">    property int selectedSecond: 0</span>
<span class="line"></span>
<span class="line">    property int currentYear: new Date().getFullYear()</span>
<span class="line">    property int currentMonth: new Date().getMonth()</span>
<span class="line"></span>
<span class="line">    property bool hasSelection: false  // 选择状态标记</span>
<span class="line"></span>
<span class="line">    // 焦点区域属性</span>
<span class="line">    property int focusArea: 0  // 0: 日期, 1: 时, 2: 分, 3: 秒</span>
<span class="line">    property int focusedDateIndex: 0  // 日历格子索引</span>
<span class="line"></span>
<span class="line">    signal confirmed(date datetime)</span>
<span class="line"></span>
<span class="line">    background: Rectangle {</span>
<span class="line">        color: dateTimePicker.colorBackground</span>
<span class="line">        radius: 8</span>
<span class="line"></span>
<span class="line">        FocusScope {</span>
<span class="line">            id: keyboardHandler</span>
<span class="line">            anchors.fill: parent</span>
<span class="line">            focus: true</span>
<span class="line"></span>
<span class="line">            Keys.onPressed: function (event) {</span>
<span class="line">                if (event.key === Qt.Key_Left) {</span>
<span class="line">                    if (dateTimePicker.focusArea === 0) {</span>
<span class="line">                        dateTimePicker.focusedDateIndex = Math.max(0, dateTimePicker.focusedDateIndex - 1)</span>
<span class="line">                        dateTimePicker.selectedDate = getDateForCell(dateTimePicker.focusedDateIndex)</span>
<span class="line">                        dateTimePicker.hasSelection = true</span>
<span class="line">                    } else if (dateTimePicker.focusArea &gt; 0) {</span>
<span class="line">                        dateTimePicker.focusArea = Math.max(0, dateTimePicker.focusArea - 1)</span>
<span class="line">                    }</span>
<span class="line">                    event.accepted = true</span>
<span class="line">                } else if (event.key === Qt.Key_Right) {</span>
<span class="line">                    if (dateTimePicker.focusArea === 0) {</span>
<span class="line">                        dateTimePicker.focusedDateIndex = Math.min(41, dateTimePicker.focusedDateIndex + 1)</span>
<span class="line">                        dateTimePicker.selectedDate = getDateForCell(dateTimePicker.focusedDateIndex)</span>
<span class="line">                        dateTimePicker.hasSelection = true</span>
<span class="line">                    } else if (dateTimePicker.focusArea &lt; 3) {</span>
<span class="line">                        dateTimePicker.focusArea = Math.min(3, dateTimePicker.focusArea + 1)</span>
<span class="line">                    }</span>
<span class="line">                    event.accepted = true</span>
<span class="line">                } else if (event.key === Qt.Key_Up) {</span>
<span class="line">                    if (dateTimePicker.focusArea === 0) {</span>
<span class="line">                        dateTimePicker.focusedDateIndex = Math.max(0, dateTimePicker.focusedDateIndex - 7)</span>
<span class="line">                        dateTimePicker.selectedDate = getDateForCell(dateTimePicker.focusedDateIndex)</span>
<span class="line">                        dateTimePicker.hasSelection = true</span>
<span class="line">                    } else {</span>
<span class="line">                        if (dateTimePicker.focusArea === 1) {</span>
<span class="line">                            dateTimePicker.selectedHour = (dateTimePicker.selectedHour - 1 + 24) % 24</span>
<span class="line">                        } else if (dateTimePicker.focusArea === 2) {</span>
<span class="line">                            dateTimePicker.selectedMinute = (dateTimePicker.selectedMinute - 1 + 60) % 60</span>
<span class="line">                        } else {</span>
<span class="line">                            dateTimePicker.selectedSecond = (dateTimePicker.selectedSecond - 1 + 60) % 60</span>
<span class="line">                        }</span>
<span class="line">                        dateTimePicker.hasSelection = true</span>
<span class="line">                    }</span>
<span class="line">                    event.accepted = true</span>
<span class="line">                } else if (event.key === Qt.Key_Down) {</span>
<span class="line">                    if (dateTimePicker.focusArea === 0) {</span>
<span class="line">                        dateTimePicker.focusedDateIndex = Math.min(41, dateTimePicker.focusedDateIndex + 7)</span>
<span class="line">                        dateTimePicker.selectedDate = getDateForCell(dateTimePicker.focusedDateIndex)</span>
<span class="line">                        dateTimePicker.hasSelection = true</span>
<span class="line">                    } else {</span>
<span class="line">                        if (dateTimePicker.focusArea === 1) {</span>
<span class="line">                            dateTimePicker.selectedHour = (dateTimePicker.selectedHour + 1) % 24</span>
<span class="line">                        } else if (dateTimePicker.focusArea === 2) {</span>
<span class="line">                            dateTimePicker.selectedMinute = (dateTimePicker.selectedMinute + 1) % 60</span>
<span class="line">                        } else {</span>
<span class="line">                            dateTimePicker.selectedSecond = (dateTimePicker.selectedSecond + 1) % 60</span>
<span class="line">                        }</span>
<span class="line">                        dateTimePicker.hasSelection = true</span>
<span class="line">                    }</span>
<span class="line">                    event.accepted = true</span>
<span class="line">                } else if (event.key === Qt.Key_Tab) {</span>
<span class="line">                    dateTimePicker.focusArea = (dateTimePicker.focusArea + 1) % 4</span>
<span class="line">                    event.accepted = true</span>
<span class="line">                } else if (event.key === Qt.Key_Backtab) {</span>
<span class="line">                    dateTimePicker.focusArea = (dateTimePicker.focusArea - 1 + 4) % 4</span>
<span class="line">                    event.accepted = true</span>
<span class="line">                } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {</span>
<span class="line">                    if (dateTimePicker.hasSelection) {</span>
<span class="line">                        let dt = new Date(dateTimePicker.selectedDate)</span>
<span class="line">                        dt.setHours(dateTimePicker.selectedHour)</span>
<span class="line">                        dt.setMinutes(dateTimePicker.selectedMinute)</span>
<span class="line">                        dt.setSeconds(dateTimePicker.selectedSecond)</span>
<span class="line">                        dateTimePicker.confirmed(dt)</span>
<span class="line">                        dateTimePicker.close()</span>
<span class="line">                    }</span>
<span class="line">                    event.accepted = true</span>
<span class="line">                } else if (event.key === Qt.Key_Escape) {</span>
<span class="line">                    dateTimePicker.close()</span>
<span class="line">                    event.accepted = true</span>
<span class="line">                }</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    ColumnLayout {</span>
<span class="line">        anchors.fill: parent</span>
<span class="line">        spacing: 0</span>
<span class="line"></span>
<span class="line">        // 顶部日期时间显示</span>
<span class="line">        Rectangle {</span>
<span class="line">            Layout.fillWidth: true</span>
<span class="line">            Layout.preferredHeight: 50</span>
<span class="line">            color: dateTimePicker.colorSurface</span>
<span class="line">            radius: 8</span>
<span class="line"></span>
<span class="line">            Rectangle {</span>
<span class="line">                anchors.left: parent.left</span>
<span class="line">                anchors.right: parent.right</span>
<span class="line">                anchors.bottom: parent.bottom</span>
<span class="line">                height: 8</span>
<span class="line">                color: parent.color</span>
<span class="line">            }</span>
<span class="line"></span>
<span class="line">            Label {</span>
<span class="line">                id: dateTimeLabel</span>
<span class="line"></span>
<span class="line">                anchors.centerIn: parent</span>
<span class="line">                color: dateTimePicker.colorPrimary</span>
<span class="line">                font.pixelSize: 16</span>
<span class="line">                font.bold: true</span>
<span class="line">                text: Qt.formatDateTime(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedHour, selectedMinute, selectedSecond), dateFormat + &quot; &quot; + timeFormat)</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 主内容区域</span>
<span class="line">        RowLayout {</span>
<span class="line">            Layout.fillWidth: true</span>
<span class="line">            Layout.fillHeight: true</span>
<span class="line">            Layout.margins: 20</span>
<span class="line">            spacing: 20</span>
<span class="line"></span>
<span class="line">            // 左侧日历区域</span>
<span class="line">            ColumnLayout {</span>
<span class="line">                Layout.fillWidth: true</span>
<span class="line">                Layout.fillHeight: true</span>
<span class="line">                spacing: 12</span>
<span class="line"></span>
<span class="line">                // 月份导航栏</span>
<span class="line">                RowLayout {</span>
<span class="line">                    Layout.fillWidth: true</span>
<span class="line">                    spacing: 8</span>
<span class="line"></span>
<span class="line">                    Button {</span>
<span class="line">                        text: &quot;&lt;&lt;&quot;</span>
<span class="line">                        Layout.preferredWidth: 40</span>
<span class="line">                        Layout.preferredHeight: 32</span>
<span class="line">                        onClicked: {</span>
<span class="line">                            currentYear -= 1</span>
<span class="line">                        }</span>
<span class="line">                        background: Rectangle {</span>
<span class="line">                            color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder</span>
<span class="line">                            radius: 4</span>
<span class="line">                        }</span>
<span class="line">                        contentItem: Text {</span>
<span class="line">                            text: parent.text</span>
<span class="line">                            color: dateTimePicker.colorTextPrimary</span>
<span class="line">                            horizontalAlignment: Text.AlignHCenter</span>
<span class="line">                            verticalAlignment: Text.AlignVCenter</span>
<span class="line">                        }</span>
<span class="line">                    }</span>
<span class="line">                    Button {</span>
<span class="line">                        text: &quot;&lt;&quot;</span>
<span class="line">                        Layout.preferredWidth: 40</span>
<span class="line">                        Layout.preferredHeight: 32</span>
<span class="line">                        onClicked: {</span>
<span class="line">                            currentMonth -= 1</span>
<span class="line">                            if (currentMonth &lt; 0) {</span>
<span class="line">                                currentMonth = 11</span>
<span class="line">                                currentYear -= 1</span>
<span class="line">                            }</span>
<span class="line">                        }</span>
<span class="line">                        background: Rectangle {</span>
<span class="line">                            color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder</span>
<span class="line">                            radius: 4</span>
<span class="line">                        }</span>
<span class="line">                        contentItem: Text {</span>
<span class="line">                            text: parent.text</span>
<span class="line">                            color: dateTimePicker.colorTextPrimary</span>
<span class="line">                            horizontalAlignment: Text.AlignHCenter</span>
<span class="line">                            verticalAlignment: Text.AlignVCenter</span>
<span class="line">                        }</span>
<span class="line">                    }</span>
<span class="line">                    Label {</span>
<span class="line">                        text: Qt.formatDate(new Date(currentYear, currentMonth), &quot;yyyy年 M月&quot;)</span>
<span class="line">                        color: dateTimePicker.colorTextPrimary</span>
<span class="line">                        font.pixelSize: 16</span>
<span class="line">                        font.bold: true</span>
<span class="line">                        Layout.fillWidth: true</span>
<span class="line">                        horizontalAlignment: Text.AlignHCenter</span>
<span class="line">                    }</span>
<span class="line">                    Button {</span>
<span class="line">                        text: &quot;&gt;&quot;</span>
<span class="line">                        Layout.preferredWidth: 40</span>
<span class="line">                        Layout.preferredHeight: 32</span>
<span class="line">                        onClicked: {</span>
<span class="line">                            currentMonth += 1</span>
<span class="line">                            if (currentMonth &gt; 11) {</span>
<span class="line">                                currentMonth = 0</span>
<span class="line">                                currentYear += 1</span>
<span class="line">                            }</span>
<span class="line">                        }</span>
<span class="line">                        background: Rectangle {</span>
<span class="line">                            color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder</span>
<span class="line">                            radius: 4</span>
<span class="line">                        }</span>
<span class="line">                        contentItem: Text {</span>
<span class="line">                            text: parent.text</span>
<span class="line">                            color: dateTimePicker.colorTextPrimary</span>
<span class="line">                            horizontalAlignment: Text.AlignHCenter</span>
<span class="line">                            verticalAlignment: Text.AlignVCenter</span>
<span class="line">                        }</span>
<span class="line">                    }</span>
<span class="line">                    Button {</span>
<span class="line">                        text: &quot;&gt;&gt;&quot;</span>
<span class="line">                        Layout.preferredWidth: 40</span>
<span class="line">                        Layout.preferredHeight: 32</span>
<span class="line">                        onClicked: {</span>
<span class="line">                            currentYear += 1</span>
<span class="line">                        }</span>
<span class="line">                        background: Rectangle {</span>
<span class="line">                            color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder</span>
<span class="line">                            radius: 4</span>
<span class="line">                        }</span>
<span class="line">                        contentItem: Text {</span>
<span class="line">                            text: parent.text</span>
<span class="line">                            color: dateTimePicker.colorTextPrimary</span>
<span class="line">                            horizontalAlignment: Text.AlignHCenter</span>
<span class="line">                            verticalAlignment: Text.AlignVCenter</span>
<span class="line">                        }</span>
<span class="line">                    }</span>
<span class="line">                }</span>
<span class="line"></span>
<span class="line">                // 星期标题行</span>
<span class="line">                GridLayout {</span>
<span class="line">                    Layout.fillWidth: true</span>
<span class="line">                    columns: 7</span>
<span class="line">                    rowSpacing: 0</span>
<span class="line">                    columnSpacing: 0</span>
<span class="line"></span>
<span class="line">                    Repeater {</span>
<span class="line">                        model: [&quot;周一&quot;, &quot;周二&quot;, &quot;周三&quot;, &quot;周四&quot;, &quot;周五&quot;, &quot;周六&quot;, &quot;周日&quot;]</span>
<span class="line">                        Label {</span>
<span class="line">                            text: modelData</span>
<span class="line">                            color: dateTimePicker.colorTextTertiary</span>
<span class="line">                            font.pixelSize: 12</span>
<span class="line">                            horizontalAlignment: Text.AlignHCenter</span>
<span class="line">                            verticalAlignment: Text.AlignVCenter</span>
<span class="line">                            Layout.fillWidth: true</span>
<span class="line">                            Layout.preferredHeight: 30</span>
<span class="line">                        }</span>
<span class="line">                    }</span>
<span class="line">                }</span>
<span class="line"></span>
<span class="line">                // 日期网格</span>
<span class="line">                GridLayout {</span>
<span class="line">                    Layout.fillWidth: true</span>
<span class="line">                    Layout.fillHeight: true</span>
<span class="line">                    columns: 7</span>
<span class="line">                    rowSpacing: 8</span>
<span class="line">                    columnSpacing: 8</span>
<span class="line"></span>
<span class="line">                    Repeater {</span>
<span class="line">                        model: 42</span>
<span class="line">                        Rectangle {</span>
<span class="line">                            Layout.fillWidth: true</span>
<span class="line">                            Layout.fillHeight: true</span>
<span class="line">                            Layout.minimumHeight: 40</span>
<span class="line">                            radius: 4</span>
<span class="line"></span>
<span class="line">                            color: {</span>
<span class="line">                                if (!isInRange) return dateTimePicker.colorSurfaceVariant</span>
<span class="line"></span>
<span class="line">                                let date = getDateForCell(index)</span>
<span class="line">                                if (date.getDate() === selectedDate.getDate() &amp;&amp; date.getMonth() === selectedDate.getMonth() &amp;&amp; date.getFullYear() === selectedDate.getFullYear()) {</span>
<span class="line">                                    return dateTimePicker.colorPrimary</span>
<span class="line">                                }</span>
<span class="line">                                return dateMouseArea.containsMouse ? dateTimePicker.colorBorder : &quot;transparent&quot;</span>
<span class="line">                            }</span>
<span class="line"></span>
<span class="line">                            border.color: {</span>
<span class="line">                                let date = cellDate</span>
<span class="line">                                if (date.getDate() === selectedDate.getDate() &amp;&amp; date.getMonth() === selectedDate.getMonth() &amp;&amp; date.getFullYear() === selectedDate.getFullYear()) {</span>
<span class="line">                                    return &quot;white&quot;</span>
<span class="line">                                }</span>
<span class="line">                                return &quot;transparent&quot;</span>
<span class="line">                            }</span>
<span class="line">                            border.width: 2</span>
<span class="line"></span>
<span class="line">                            property var cellDate: getDateForCell(index)</span>
<span class="line"></span>
<span class="line">                            property bool isInRange: {</span>
<span class="line">                                let testDate = new Date(cellDate)</span>
<span class="line">                                testDate.setHours(selectedHour, selectedMinute, selectedSecond)</span>
<span class="line">                                return isDateTimeInRange(testDate)</span>
<span class="line">                            }</span>
<span class="line"></span>
<span class="line">                            Label {</span>
<span class="line">                                anchors.centerIn: parent</span>
<span class="line">                                text: parent.cellDate.getDate()</span>
<span class="line">                                color: {</span>
<span class="line">                                    if (!parent.isInRange) return dateTimePicker.colorTextDisabled</span>
<span class="line">                                    return parent.cellDate.getMonth() === currentMonth ? dateTimePicker.colorTextPrimary : dateTimePicker.colorBorderLight</span>
<span class="line">                                }</span>
<span class="line">                                font.pixelSize: 14</span>
<span class="line">                            }</span>
<span class="line"></span>
<span class="line">                            MouseArea {</span>
<span class="line">                                id: dateMouseArea</span>
<span class="line">                                anchors.fill: parent</span>
<span class="line">                                hoverEnabled: true</span>
<span class="line">                                enabled: parent.isInRange</span>
<span class="line">                                cursorShape: enabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor</span>
<span class="line">                                onClicked: {</span>
<span class="line">                                    if (parent.isInRange) {</span>
<span class="line">                                        let clickedDate = parent.cellDate</span>
<span class="line">                                        selectedDate = clickedDate</span>
<span class="line"></span>
<span class="line">                                        // 如果点击的日期不在当前月,自动切换到该月</span>
<span class="line">                                        if (clickedDate.getMonth() !== currentMonth || clickedDate.getFullYear() !== currentYear) {</span>
<span class="line">                                            currentMonth = clickedDate.getMonth()</span>
<span class="line">                                            currentYear = clickedDate.getFullYear()</span>
<span class="line">                                        }</span>
<span class="line"></span>
<span class="line">                                        dateTimePicker.hasSelection = true</span>
<span class="line">                                    }</span>
<span class="line">                                }</span>
<span class="line">                            }</span>
<span class="line">                        }</span>
<span class="line">                    }</span>
<span class="line">                }</span>
<span class="line">            }</span>
<span class="line"></span>
<span class="line">            // 分隔线</span>
<span class="line">            Rectangle {</span>
<span class="line">                Layout.preferredWidth: 1</span>
<span class="line">                Layout.fillHeight: true</span>
<span class="line">                color: dateTimePicker.colorBorder</span>
<span class="line">            }</span>
<span class="line"></span>
<span class="line">            // 右侧时间选择区域</span>
<span class="line">            RowLayout {</span>
<span class="line">                Layout.preferredWidth: 210</span>
<span class="line">                Layout.fillHeight: true</span>
<span class="line">                spacing: 8</span>
<span class="line"></span>
<span class="line">                // 时间列组件</span>
<span class="line">                Repeater {</span>
<span class="line">                    model: [{label: &quot;时&quot;, value: selectedHour, max: 24}, {</span>
<span class="line">                        label: &quot;分&quot;, value: selectedMinute, max: 60</span>
<span class="line">                    }, {label: &quot;秒&quot;, value: selectedSecond, max: 60}]</span>
<span class="line"></span>
<span class="line">                    ColumnLayout {</span>
<span class="line">                        Layout.fillWidth: true</span>
<span class="line">                        Layout.fillHeight: true</span>
<span class="line">                        spacing: 8</span>
<span class="line"></span>
<span class="line">                        property string timeLabel: modelData.label</span>
<span class="line"></span>
<span class="line">                        Label {</span>
<span class="line">                            text: timeLabel</span>
<span class="line">                            color: dateTimePicker.colorTextTertiary</span>
<span class="line">                            font.pixelSize: 12</span>
<span class="line">                            Layout.alignment: Qt.AlignHCenter</span>
<span class="line">                        }</span>
<span class="line"></span>
<span class="line">                        Rectangle {</span>
<span class="line">                            Layout.fillWidth: true</span>
<span class="line">                            Layout.fillHeight: true</span>
<span class="line">                            color: dateTimePicker.colorSurface</span>
<span class="line">                            radius: 4</span>
<span class="line">                            border.color: dateTimePicker.colorBorder</span>
<span class="line">                            border.width: 1</span>
<span class="line"></span>
<span class="line">                            ScrollView {</span>
<span class="line">                                anchors.fill: parent</span>
<span class="line">                                anchors.margins: 2</span>
<span class="line">                                clip: true</span>
<span class="line">                                ScrollBar.horizontal.policy: ScrollBar.AlwaysOff</span>
<span class="line"></span>
<span class="line">                                ScrollBar.vertical: ScrollBar {</span>
<span class="line">                                    policy: ScrollBar.AsNeeded</span>
<span class="line">                                    width: 8</span>
<span class="line"></span>
<span class="line">                                    contentItem: Rectangle {</span>
<span class="line">                                        implicitWidth: 8</span>
<span class="line">                                        radius: 4</span>
<span class="line">                                        color: parent.pressed ? dateTimePicker.colorScrollbarPressed : (parent.hovered ? dateTimePicker.colorScrollbarHover : dateTimePicker.colorScrollbar)</span>
<span class="line">                                    }</span>
<span class="line"></span>
<span class="line">                                    background: Rectangle {</span>
<span class="line">                                        implicitWidth: 6</span>
<span class="line">                                        color: &quot;transparent&quot;</span>
<span class="line">                                    }</span>
<span class="line">                                }</span>
<span class="line"></span>
<span class="line">                                ListView {</span>
<span class="line">                                    id: timeListView</span>
<span class="line"></span>
<span class="line">                                    model: modelData.max</span>
<span class="line">                                    highlightFollowsCurrentItem: false</span>
<span class="line">                                    highlightMoveDuration: 0</span>
<span class="line">                                    snapMode: ListView.SnapToItem</span>
<span class="line"></span>
<span class="line">                                    readonly property string timeType: timeLabel</span>
<span class="line"></span>
<span class="line">                                    readonly property int currentValue: {</span>
<span class="line">                                        if (timeType === &quot;时&quot;) return dateTimePicker.selectedHour</span>
<span class="line">                                        if (timeType === &quot;分&quot;) return dateTimePicker.selectedMinute</span>
<span class="line">                                        return dateTimePicker.selectedSecond</span>
<span class="line">                                    }</span>
<span class="line"></span>
<span class="line">                                    function selectTime(value) {</span>
<span class="line">                                        console.log(&quot;Selected &quot; + timeListView.timeType + &quot;: &quot; + value + &quot;, hasSelection: &quot; + dateTimePicker.hasSelection)</span>
<span class="line"></span>
<span class="line">                                        dateTimePicker.hasSelection = true</span>
<span class="line"></span>
<span class="line">                                        if (timeType === &quot;时&quot;) {</span>
<span class="line">                                            dateTimePicker.selectedHour = value</span>
<span class="line">                                        } else if (timeType === &quot;分&quot;) {</span>
<span class="line">                                            dateTimePicker.selectedMinute = value</span>
<span class="line">                                        } else {</span>
<span class="line">                                            dateTimePicker.selectedSecond = value</span>
<span class="line">                                        }</span>
<span class="line"></span>
<span class="line">                                        // 滚动到列表顶部</span>
<span class="line">                                        positionViewAtIndex(value, ListView.Beginning)</span>
<span class="line">                                    }</span>
<span class="line"></span>
<span class="line">                                    delegate: Rectangle {</span>
<span class="line">                                        width: timeListView.width</span>
<span class="line">                                        height: 44</span>
<span class="line">                                        radius: 4</span>
<span class="line"></span>
<span class="line">                                        color: {</span>
<span class="line">                                            if (index === timeListView.currentValue) return dateTimePicker.colorPrimary</span>
<span class="line">                                            return timeItemMouseArea.containsMouse ? dateTimePicker.colorHover : &quot;transparent&quot;</span>
<span class="line">                                        }</span>
<span class="line"></span>
<span class="line">                                        Label {</span>
<span class="line">                                            anchors.centerIn: parent</span>
<span class="line">                                            text: index.toString().padStart(2, &#39;0&#39;)</span>
<span class="line">                                            color: index === timeListView.currentValue ? dateTimePicker.colorTextPrimary : dateTimePicker.colorTextSecondary</span>
<span class="line">                                            font.pixelSize: 16</span>
<span class="line">                                            font.bold: index === timeListView.currentValue</span>
<span class="line">                                        }</span>
<span class="line"></span>
<span class="line">                                        MouseArea {</span>
<span class="line">                                            id: timeItemMouseArea</span>
<span class="line">                                            anchors.fill: parent</span>
<span class="line">                                            hoverEnabled: true</span>
<span class="line">                                            cursorShape: Qt.PointingHandCursor</span>
<span class="line">                                            onClicked: {</span>
<span class="line">                                                timeListView.selectTime(index)</span>
<span class="line">                                            }</span>
<span class="line">                                        }</span>
<span class="line">                                    }</span>
<span class="line"></span>
<span class="line">                                    Component.onCompleted: {</span>
<span class="line">                                        positionViewAtIndex(modelData.value, ListView.Beginning)</span>
<span class="line">                                    }</span>
<span class="line">                                }</span>
<span class="line">                            }</span>
<span class="line">                        }</span>
<span class="line">                    }</span>
<span class="line">                }</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 底部按钮区域</span>
<span class="line">        Rectangle {</span>
<span class="line">            Layout.fillWidth: true</span>
<span class="line">            Layout.preferredHeight: 60</span>
<span class="line">            color: dateTimePicker.colorSurface</span>
<span class="line"></span>
<span class="line">            Rectangle {</span>
<span class="line">                anchors.left: parent.left</span>
<span class="line">                anchors.right: parent.right</span>
<span class="line">                anchors.top: parent.top</span>
<span class="line">                height: 8</span>
<span class="line">                color: parent.color</span>
<span class="line">            }</span>
<span class="line"></span>
<span class="line">            RowLayout {</span>
<span class="line">                anchors.fill: parent</span>
<span class="line">                anchors.margins: 15</span>
<span class="line">                spacing: 10</span>
<span class="line"></span>
<span class="line">                Button {</span>
<span class="line">                    text: qsTr(&quot;今天&quot;)</span>
<span class="line">                    Layout.preferredWidth: 80</span>
<span class="line">                    Layout.preferredHeight: 36</span>
<span class="line">                    onClicked: {</span>
<span class="line">                        var now = new Date()</span>
<span class="line">                        selectedDate = now</span>
<span class="line">                        selectedHour = now.getHours()</span>
<span class="line">                        selectedMinute = now.getMinutes()</span>
<span class="line">                        selectedSecond = now.getSeconds()</span>
<span class="line">                        currentYear = now.getFullYear()</span>
<span class="line">                        currentMonth = now.getMonth()</span>
<span class="line">                        hasSelection = true</span>
<span class="line">                    }</span>
<span class="line">                    background: Rectangle {</span>
<span class="line">                        color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder</span>
<span class="line">                        radius: 4</span>
<span class="line">                        border.color: dateTimePicker.colorBorderLight</span>
<span class="line">                        border.width: 1</span>
<span class="line">                    }</span>
<span class="line">                    contentItem: Text {</span>
<span class="line">                        text: parent.text</span>
<span class="line">                        color: dateTimePicker.colorTextSecondary</span>
<span class="line">                        font.pixelSize: 14</span>
<span class="line">                        horizontalAlignment: Text.AlignHCenter</span>
<span class="line">                        verticalAlignment: Text.AlignVCenter</span>
<span class="line">                    }</span>
<span class="line">                }</span>
<span class="line"></span>
<span class="line">                Item {</span>
<span class="line">                    Layout.fillWidth: true</span>
<span class="line">                }</span>
<span class="line"></span>
<span class="line">                Button {</span>
<span class="line">                    text: qsTr(&quot;取消&quot;)</span>
<span class="line">                    Layout.preferredWidth: 80</span>
<span class="line">                    Layout.preferredHeight: 36</span>
<span class="line">                    onClicked: dateTimePicker.close()</span>
<span class="line">                    background: Rectangle {</span>
<span class="line">                        color: parent.hovered ? dateTimePicker.colorHoverDark : dateTimePicker.colorBorder</span>
<span class="line">                        radius: 4</span>
<span class="line">                        border.color: dateTimePicker.colorBorderLight</span>
<span class="line">                        border.width: 1</span>
<span class="line">                    }</span>
<span class="line">                    contentItem: Text {</span>
<span class="line">                        text: parent.text</span>
<span class="line">                        color: dateTimePicker.colorTextSecondary</span>
<span class="line">                        font.pixelSize: 14</span>
<span class="line">                        horizontalAlignment: Text.AlignHCenter</span>
<span class="line">                        verticalAlignment: Text.AlignVCenter</span>
<span class="line">                    }</span>
<span class="line">                }</span>
<span class="line"></span>
<span class="line">                Button {</span>
<span class="line">                    text: qsTr(&quot;确定&quot;)</span>
<span class="line">                    Layout.preferredWidth: 80</span>
<span class="line">                    Layout.preferredHeight: 36</span>
<span class="line">                    enabled: dateTimePicker.hasSelection</span>
<span class="line">                    onClicked: {</span>
<span class="line">                        let dt = new Date(selectedDate)</span>
<span class="line">                        dt.setHours(selectedHour)</span>
<span class="line">                        dt.setMinutes(selectedMinute)</span>
<span class="line">                        dt.setSeconds(selectedSecond)</span>
<span class="line"></span>
<span class="line">                        if (isDateTimeInRange(dt)) {</span>
<span class="line">                            dateTimePicker.dateTime = formatDateTime(dt)</span>
<span class="line">                            confirmed(dt)</span>
<span class="line">                            close()</span>
<span class="line">                        }</span>
<span class="line">                    }</span>
<span class="line">                    background: Rectangle {</span>
<span class="line">                        color: {</span>
<span class="line">                            if (!parent.enabled) return dateTimePicker.colorDisabled</span>
<span class="line">                            return parent.hovered ? dateTimePicker.colorPrimaryHover : dateTimePicker.colorPrimary</span>
<span class="line">                        }</span>
<span class="line">                        radius: 4</span>
<span class="line">                    }</span>
<span class="line">                    contentItem: Text {</span>
<span class="line">                        text: parent.text</span>
<span class="line">                        color: parent.enabled ? dateTimePicker.colorTextPrimary : dateTimePicker.colorTextTertiary</span>
<span class="line">                        font.pixelSize: 14</span>
<span class="line">                        font.bold: true</span>
<span class="line">                        horizontalAlignment: Text.AlignHCenter</span>
<span class="line">                        verticalAlignment: Text.AlignVCenter</span>
<span class="line">                    }</span>
<span class="line">                }</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    function getDateForCell(index) {</span>
<span class="line">        let firstDay = new Date(currentYear, currentMonth, 1)</span>
<span class="line">        let dayOfWeek = (firstDay.getDay() + 6) % 7</span>
<span class="line">        let cellDate = new Date(currentYear, currentMonth, 1 - dayOfWeek + index)</span>
<span class="line">        return cellDate</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    function isDateTimeInRange(date) {</span>
<span class="line">        if (minDateTime) {</span>
<span class="line">            let minDt = new Date(minDateTime)</span>
<span class="line">            if (!isNaN(minDt.getTime()) &amp;&amp; date &lt; minDt) {</span>
<span class="line">                return false</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">        if (maxDateTime) {</span>
<span class="line">            let maxDt = new Date(maxDateTime)</span>
<span class="line">            if (!isNaN(maxDt.getTime()) &amp;&amp; date &gt; maxDt) {</span>
<span class="line">                return false</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">        return true</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    function formatDateTime(date) {</span>
<span class="line">        return Qt.formatDateTime(date, dateFormat + &quot; &quot; + timeFormat)</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    onDateTimeChanged: {</span>
<span class="line">        if (!hasSelection) {</span>
<span class="line">            let dt = new Date(dateTime)</span>
<span class="line">            if (!isNaN(dt.getTime())) {</span>
<span class="line">                selectedDate = dt</span>
<span class="line">                selectedHour = dt.getHours()</span>
<span class="line">                selectedMinute = dt.getMinutes()</span>
<span class="line">                selectedSecond = dt.getSeconds()</span>
<span class="line">                currentYear = dt.getFullYear()</span>
<span class="line">                currentMonth = dt.getMonth()</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    Component.onCompleted: {</span>
<span class="line">        if (dateTime) {</span>
<span class="line">            let dt = new Date(dateTime)</span>
<span class="line">            if (!isNaN(dt.getTime())) {</span>
<span class="line">                selectedDate = dt</span>
<span class="line">                selectedHour = dt.getHours()</span>
<span class="line">                selectedMinute = dt.getMinutes()</span>
<span class="line">                selectedSecond = dt.getSeconds()</span>
<span class="line">                currentYear = dt.getFullYear()</span>
<span class="line">                currentMonth = dt.getMonth()</span>
<span class="line"></span>
<span class="line">                hasSelection = true</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 初始化焦点位置</span>
<span class="line">        let firstDay = new Date(currentYear, currentMonth, 1)</span>
<span class="line">        let dayOfWeek = (firstDay.getDay() + 6) % 7</span>
<span class="line">        focusedDateIndex = dayOfWeek + selectedDate.getDate() - 1</span>
<span class="line"></span>
<span class="line">        // 延迟设置焦点,确保 FocusScope 已完全初始化</span>
<span class="line">        Qt.callLater(function () {</span>
<span class="line">            keyboardHandler.forceActiveFocus()</span>
<span class="line">        })</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="三、组件使用示例" tabindex="-1"><a class="header-anchor" href="#三、组件使用示例"><span>三、组件使用示例</span></a></h2><p>以下是完整的使用示例，包含一个触发按钮和文本框，点击按钮弹出选择器，选择后更新文本框内容。</p><div class="language-qmllang line-numbers-mode" data-highlighter="prismjs" data-ext="qmllang"><pre><code><span class="line">DateTimePicker {</span>
<span class="line">    id: dateTimePicker</span>
<span class="line"></span>
<span class="line">    width: 250</span>
<span class="line">    height: 40</span>
<span class="line"></span>
<span class="line">    // 初始值为当前日期时间</span>
<span class="line">    dateTime: Qt.formatDateTime(new Date(), &quot;yyyy-MM-dd hh:mm:ss&quot;)</span>
<span class="line"></span>
<span class="line">    // 日期格式</span>
<span class="line">    dateFormat: &quot;yyyy-MM-dd&quot;</span>
<span class="line">    // 时间格式</span>
<span class="line">    timeFormat: &quot;hh:mm:ss&quot;</span>
<span class="line"></span>
<span class="line">    // 最小可选日期时间</span>
<span class="line">    minDateTime: &quot;2023-01-01 00:00:00&quot;</span>
<span class="line">    // 最大可选日期时间</span>
<span class="line">    maxDateTime: &quot;2024-12-31 23:59:59&quot;</span>
<span class="line"></span>
<span class="line">    onConfirmed: function (datetime) {</span>
<span class="line">        startDateField.text = Qt.formatDateTime(datetime, &quot;yyyy-MM-dd HH:mm&quot;)</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>显示效果：</p><p><img src="`+l+'" alt="后台用户登录界面"></p><h2 id="四、关键属性与信号说明" tabindex="-1"><a class="header-anchor" href="#四、关键属性与信号说明"><span>四、关键属性与信号说明</span></a></h2><table><thead><tr><th>名称</th><th>类型</th><th>说明</th></tr></thead><tbody><tr><td><code>dateTime</code></td><td>string</td><td>选中的日期时间字符串（初始值为当前时间）</td></tr><tr><td><code>dateFormat</code></td><td>string</td><td>日期显示格式（如 &quot;yyyy-MM-dd&quot;、&quot;yyyy 年 MM 月 dd 日&quot;）</td></tr><tr><td><code>timeFormat</code></td><td>string</td><td>时间显示格式（如 &quot;hh:mm:ss&quot;、&quot;HH:mm&quot;）</td></tr><tr><td><code>minDateTime</code></td><td>string</td><td>最小可选日期时间（格式同 dateTime，空则不限制）</td></tr><tr><td><code>maxDateTime</code></td><td>string</td><td>最大可选日期时间（格式同 dateTime，空则不限制）</td></tr><tr><td><code>confirmed</code></td><td>signal</td><td>确认选择时触发，参数为选中的 Date 对象</td></tr></tbody></table><h2 id="五、注意事项" tabindex="-1"><a class="header-anchor" href="#五、注意事项"><span>五、注意事项</span></a></h2><ol><li><strong>Qt 版本要求</strong>：组件基于 Qt6.10 开发，依赖 QtQuick.Controls 6.10 的 API，低版本可能存在兼容性问题；</li><li><strong>日期格式兼容</strong>：<code>minDateTime</code>/<code>maxDateTime</code>需与dateFormat/timeFormat匹配，否则可能导致范围校验失效；</li><li><strong>焦点管理</strong>：组件内置 FocusScope 处理键盘事件，使用时需确保 Popup 获得焦点；</li><li><strong>性能优化</strong>：日期网格使用 Repeater 复用组件，避免重复创建，适合高频使用场景；</li><li><strong>国际化</strong>：按钮文本使用<code>qsTr()</code>包裹，支持多语言翻译。</li></ol><h2 id="六、扩展方向" tabindex="-1"><a class="header-anchor" href="#六、扩展方向"><span>六、扩展方向</span></a></h2><ol><li><strong>浅色主题适配</strong>：新增浅色主题常量，通过属性切换主题；</li><li><strong>自定义样式</strong>：暴露更多样式属性（如圆角、字体大小），支持外部自定义；</li><li><strong>时间步长</strong>：增加时 / 分 / 秒的步长属性（如 5 分钟步长）；</li><li><strong>本地化</strong>：适配不同地区的星期显示（如英文周一 = Monday）；</li><li><strong>快捷键扩展</strong>：支持 Home/End 键快速跳转到时间极值。</li></ol><h2 id="七、总结" tabindex="-1"><a class="header-anchor" href="#七、总结"><span>七、总结</span></a></h2><p>本文实现的 <code>DateTimePicker</code> 组件兼顾了 UI 美观性和交互实用性，通过模块化设计将日期选择、时间选择、交互逻辑分离，便于维护和扩展。组件支持键盘 / 鼠标双交互模式，满足不同操作习惯，同时提供灵活的时间范围限制，可直接应用于 Qt6 QML 项目中的日期时间选择场景。</p>',20)])])}const p=s(d,[["render",c]]),v=JSON.parse('{"path":"/posts/qt_qml_date_time_picker.html","title":"Qt6 QML 自定义 DateTimePicker 组件：完整实现与使用指南","lang":"zh-CN","frontmatter":{"date":"2020-01-01T00:00:00.000Z","category":["C++编程"],"tag":["C++","Qt"],"sticky":10},"headers":[{"level":2,"title":"一、组件核心特性","slug":"一、组件核心特性","link":"#一、组件核心特性","children":[]},{"level":2,"title":"二、完整实现代码","slug":"二、完整实现代码","link":"#二、完整实现代码","children":[]},{"level":2,"title":"三、组件使用示例","slug":"三、组件使用示例","link":"#三、组件使用示例","children":[]},{"level":2,"title":"四、关键属性与信号说明","slug":"四、关键属性与信号说明","link":"#四、关键属性与信号说明","children":[]},{"level":2,"title":"五、注意事项","slug":"五、注意事项","link":"#五、注意事项","children":[]},{"level":2,"title":"六、扩展方向","slug":"六、扩展方向","link":"#六、扩展方向","children":[]},{"level":2,"title":"七、总结","slug":"七、总结","link":"#七、总结","children":[]}],"git":{"updatedTime":1774788457000,"contributors":[{"name":"Bobo","username":"Bobo","email":"yanglinbo@gmail.com","commits":4,"url":"https://github.com/Bobo"}],"changelog":[{"hash":"a3e88b19cfead00baa606aa5110b2802dac32768","time":1774788457000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: REBUILD."},{"hash":"95562816fd268067d0f0152c62e0d2c33cffae1f","time":1766887746000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: edit post."},{"hash":"e73c03a5d4e7c92593556ded7b8a157386d5a9da","time":1763459362000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: edit post."},{"hash":"e2e1aef07b6f82a149f14c04863d8989d43c83f8","time":1763459109000,"email":"yanglinbo@gmail.com","author":"Bobo","message":"feat: add post"}]},"filePathRelative":"posts/qt_qml_date_time_picker.md","excerpt":"\\n<p>在 Qt 开发中，原生的日期时间选择组件往往难以满足个性化的 UI 设计和交互需求（如深色主题、自定义时间范围、键盘导航等）。本文基于 Qt6.10 版本，从零实现一款功能完整、交互友好的 DateTimePicker 组件，支持日期 + 时间联动选择、时间范围限制、键盘 / 鼠标双交互、深色主题适配等特性，可直接集成到 QML 项目中。</p>\\n<h2>一、组件核心特性</h2>\\n<table>\\n<thead>\\n<tr>\\n<th>特性</th>\\n<th>说明</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td>深色主题适配</td>\\n<td>内置统一的深色系样式常量，支持快速切换主题</td>\\n</tr>\\n<tr>\\n<td>完整时间维度选择</td>\\n<td>支持年、月、日、时、分、秒全维度选择，日历网格可视化展示</td>\\n</tr>\\n<tr>\\n<td>时间范围限制</td>\\n<td>通过 <code>minDateTime</code>/<code>maxDateTime</code> 限制可选时间范围，禁用超出范围的选项</td>\\n</tr>\\n<tr>\\n<td>双交互模式</td>\\n<td>支持鼠标点击 / 悬停、键盘方向键 / Tab/Enter/Escape 操作</td>\\n</tr>\\n<tr>\\n<td>智能视觉反馈</td>\\n<td>选中状态高亮、禁用状态灰显、悬停效果、焦点区域提示</td>\\n</tr>\\n<tr>\\n<td>快捷操作</td>\\n<td>内置「今天」快捷按钮，一键恢复当前系统时间</td>\\n</tr>\\n<tr>\\n<td>自动月份切换</td>\\n<td>点击非当前月日期时，自动切换到对应月份</td>\\n</tr>\\n</tbody>\\n</table>"}');export{p as comp,v as data};
