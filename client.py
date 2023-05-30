from PyQt5.QtGui import *
from PyQt5.QtCore import *
from PyQt5.QtWidgets import *

import socket

connection = socket.socket()
connection.connect(("", 18955))  # TODO: CHANGE TO LOCAL IP


class FileButton(QToolButton):
	def __init__(self, parent, filename, path):
		super(FileButton, self).__init__(parent)
		self.setStyleSheet("background: transparent;")
		self.setIconSize(QSize(75, 75))
		self.setFont(QFont("Arial", 12))
		self.setToolButtonStyle(Qt.ToolButtonTextUnderIcon)
		self.filename = filename
		self.path = path

	def mousePressEvent(self, event):
		if event.button() == Qt.LeftButton:
			if self.parent() is not None:
				self.parent().setSelectedFile(self)
		super(FileButton, self).mousePressEvent(event)

	def mouseDoubleClickEvent(self, event):
		if event.button() == Qt.LeftButton:
			if self.parent() is not None:
				self.parent().enterFile(self)
		super(FileButton, self).mouseDoubleClickEvent(event)


class Window(QMainWindow):
	def __init__(self):
		super(Window, self).__init__()
		self.setMinimumSize(QSize(578, 354))
		self.resize(QSize(771, 472))
		self.current_directory = "/"
		self.back_history = []
		self.forward_history = []
		self.current_files = {}
		self.file_widgets = []
		self.top_bar = QToolBar(self)
		self.top_bar.setFixedHeight(40)
		self.top_bar.setMovable(False)
		self.back_action = QAction("←", self)
		self.back_action.triggered.connect(self.back)
		self.forward_action = QAction("→", self)
		self.forward_action.triggered.connect(self.forward)
		self.top_bar.addAction(self.back_action)
		self.top_bar.addAction(self.forward_action)
		self.selected_file = None
		self.selected_file_overlay = QPushButton(self)
		self.selected_file_overlay.setStyleSheet("background: rgba(0, 0, 0, 0.1); border-radius: 10px;")
		self.selected_file_overlay.hide()
		self.show()
		self.updateFiles()
		self.paintFiles()

	def back(self):
		if not self.back_history:
			return
		self.forward_history.append(self.current_directory)
		path = self.back_history.pop()
		self.changeDirectory(path, False, False)

	def forward(self):
		if not self.forward_history:
			return
		self.back_history.append(self.current_directory)
		path = self.forward_history.pop()
		self.changeDirectory(path, False, False)

	def setSelectedFile(self, widget):
		self.selected_file_overlay.move(QPoint(widget.x(), widget.y() - 5))
		self.selected_file_overlay.resize(widget.size())
		if self.selected_file_overlay.isHidden():
			self.selected_file_overlay.show()
		self.selected_file = widget

	def changeDirectory(self, path, clear_forward_history=True, append_back_history=True):
		if append_back_history:
			self.back_history.append(self.current_directory)
		if clear_forward_history:
			self.forward_history = []
		self.current_directory = path
		self.updateFiles()
		self.paintFiles()
		self.selected_file_overlay.hide()

	def enterFile(self, widget):
		if self.current_files[widget.filename]["directory"]:
			self.changeDirectory(widget.path)

	def updateFiles(self):
		connection.send(bytes(f"GET {self.current_directory}", "UTF-8"))
		self.current_files = eval(connection.recv(4096).decode("UTF-8"))

	def paintFiles(self):
		for i in self.file_widgets:
			i.setParent(None)
			i.deleteLater()
		self.file_widgets = []
		for i, properties in self.current_files.items():
			self.file_widgets.append(FileButton(self, i, (self.current_directory if self.current_directory.endswith("/") else self.current_directory + "/") + i))
			self.file_widgets[-1].setText(i)
			if properties["directory"]:
				self.file_widgets[-1].setIcon(QIcon("icons/directory.png"))
			else:
				self.file_widgets[-1].setIcon(QIcon("icons/document.png"))
			self.file_widgets[-1].show()
		self.repositionWidgets()

	def repositionWidgets(self, event=None):
		self.top_bar.setFixedWidth(self.width() if event is None else event.size().width())
		index_x, index_y = 0, 0
		for i in self.file_widgets:
			if (120 * (index_x + 1) + 10) >= (self.width() if event is None else event.size().width()):
				index_y += 1
				index_x = 0
			i.resize(QSize(100, 125))
			i.move(QPoint((120 * index_x) + 10, (135 * index_y) + self.top_bar.height() + 10))
			index_x += 1

	def resizeEvent(self, event) -> None:
		self.repositionWidgets(event)


application, window = QApplication([]), Window()
application.exec()
