# Python如何操作Docx文档

python下面关于文档操作的工具倒是多的，比如：

- [win32com](https://pypi.org/project/pywin32/)
- [python-docx](https://python-docx.readthedocs.io/en/latest/)
- [pydocx](https://pydocx.readthedocs.io/en/latest/)
- [docx2pdf](https://pypi.org/project/docx2pdf/)
- [Aspose.Words](https://products.aspose.com/words/python-net/)
- [python-docx-template](https://docxtpl.readthedocs.io/en/latest/)

## 读取docx文档

读取docx文档，需要用到`python-docx`库：

```bash
pip install python-docx
```

使用上比较简单：

```python
# 打开文档
document = Document(file_PATH)

full_text: str = ''
for paragraph in document.paragraphs:
    full_text += paragraph.text
    logger.info(paragraph.text)
```

这个库只支持docx，并不支持doc文档格式。

doc和docx是两个截然不同的格式，docx是基于XML的一个文档协议，而doc是一个二进制的文档协议。

如果遇到了doc的文档，我们要怎么办呢？我们可以使用`LibreOffice`来转换文档，然后再通过`python-docx`读取处理。

## docx模板处理

可使用`python-docx-template`这个库

```bash
pip install docxtpl
```

它内部依赖了上面的`python-docx`库来操作docx文档。

使用它也是容易的：

```python
from docxtpl import DocxTemplate

doc = DocxTemplate("my_word_template.docx")
context = { 'company_name' : "World company" }
doc.render(context)
doc.save("generated_doc.docx")
```

它使用了一个类似于Python模板引擎`Jinja2`的模板语法，玩过各种服务器渲染的模板引擎的玩家对此种语法都不陌生，上手也是容易的：

```bash
{%p jinja2_tag %} for paragraphs
{%tr jinja2_tag %} for table rows
{%tc jinja2_tag %} for table columns
{%r jinja2_tag %} for runs
```

## docx 转 pdf

我看了一下这些库，本质上都是调用了第三方软件的功能实现的转换功能。

docx2pdf只能用于Windows和MacOs。而LibreOffice几乎是全平台。

### docx2pdf

首先是docx2pdf：

```bash
pip install docx2pdf
```

使用起来倒是简单：

```python
from docx2pdf import convert

convert("input.docx")
convert("input.docx", "output.pdf")
convert("my_docx_folder/")
```

只是，这个库只支持Windows和MacoOS，不支持Linux。

### LibreOffice

```bash
sudo add-apt-repository ppa:libreoffice

sudo apt install libreoffice -y
```

查看是否安装好：

```bash
libreoffice --version
```

转换成PDF文件：

```bash
libreoffice --headless --convert-to pdf demo.docx
```

转换成DOCX文件：

```bash
libreoffice --headless --convert-to docx demo.doc
libreoffice --headless --convert-to docx demo.txt
```

## 参考资料

- [How to Install LibreOffice in Ubuntu](https://www.tecmint.com/install-libreoffice-ubuntu/)
- [Linux下使用LibreOffice+python将doc/docx/wps格式的文档转成html/txt/docx等格式](https://blog.csdn.net/weixin_41712499/article/details/107656792)
- [Starting LibreOffice with Python — Macro Programming in OpenOffice/LibreOffice with using Python[EN]-2](https://medium.com/analytics-vidhya/starting-libreoffice-with-python-macro-programming-in-openoffice-libreoffice-with-using-10310f9e69f1)
- [LibreOffice on Docker](https://medium.com/codex/libreoffice-on-docker-1a64245468c)
- [How to Batch Convert Writer Documents to PDF in LibreOffice](https://www.libreofficehelp.com/batch-convert-writer-documents-pdf-libreoffice/)
