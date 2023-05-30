import _thread
import os.path
import hashlib
import datetime
import socket as socket_


exit_ = False
ready = False


def printLine(text, type_="INFO"):
	print(f"{datetime.datetime.now()} [{type_}] {text}")


def newConnection(connection, address):
	while True:
		response = connection.recv(4096).decode("UTF-8")
		if response.startswith("GET "):
			if " HTTP/" in response:
				connection.send(bytes(f"HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n\r\n", "UTF-8"))
				response = response[:response.index(" HTTP/")].strip()
			files = {}
			try:
				for i in os.listdir(os.path.expanduser(instance.directory) + " ".join(response.split()[1:])):
					if (os.path.expanduser(instance.directory) + " ".join(response.split()[1:])).endswith("/"):
						path = os.path.expanduser(instance.directory) + " ".join(response.split()[1:])
					else:
						path = os.path.expanduser(instance.directory) + " ".join(response.split()[1:]) + "/"
					files[i] = {"directory": os.path.isdir(path + i)}
				connection.send(bytes(str(files), "utf-8"))
			except FileNotFoundError:
				printLine(f"Could not find file or directory requested by {address[0]}:{address[1]}", type_="WARN")
		elif response == "END":
			printLine(f"Connection from {address[0]}:{address[1]} closed by client")
			break
		else:
			printLine(f"Invalid command from {address[0]}:{address[1]}: '{response}'; connection has been terminated assuming the client had quit")
			break
		printLine(f"{address[0]}:{address[1]}: {response}")
	connection.close()


def inputListener():
	while True:
		input_ = input("> ").lower()
		if input_ == "start":
			instance.start()
		elif input_ == "stop":
			instance.stop()
		elif input_ == "status":
			printLine(instance.status, type_="OUTPUT")
		elif input_ == "dir":
			printLine(instance.directory, type_="OUTPUT")
		elif input_.startswith("dir "):
			if input_.split()[1] == "/":
				printLine(f"Serving from the root is insecure and may forcefully disable certain functionalities due to root-owned files/directories, proceed?", type_="WARNING")
				if input("[y/n] ").lower() not in ["y", "yes"]:
					printLine("Aborted", type_="OUTPUT")
					continue
			old_dir = instance.directory
			instance.directory = " ".join(input_.split()[1:])
			printLine(f"Successfully changed serving directory from {old_dir} to {instance.directory}", type_="OUTPUT")
		elif input_ == "quit":
			global exit_
			exit_ = True
			instance.stop()
			exit(127)
		else:
			printLine(f"Unknown command: {input_}")


class Socket:
	def __init__(self):
		self.socket = None
		self.status = "Stopped"
		self.directory = "~/shared"
		_thread.start_new_thread(inputListener, ())

	def start(self):
		if self.socket is not None:
			try:
				self.socket.laddr
			except AttributeError:
				pass
			else:
				printLine("Socket is already running", type_="ERROR")
				return
		global ready
		printLine("Creating socket... ")
		self.socket = socket_.socket()
		printLine("Initializing socket on port 18955... ")
		port = 18955
		while True:
			try:
				self.socket.bind(("", port))
				break
			except OSError:
				port += 1

		if port != 18955:
			printLine(f"Port 18955..{port - 1} are in use, initialized socket on port {port}", type_="WARN")
		self.socket.listen(10)
		printLine(f"Successfully started socket on port {port}")
		self.status = "Started"
		ready = True

	def stop(self):
		if self.socket is None:
			printLine("Socket is already closed", type_="ERROR")
			return
		global ready
		ready = False
		printLine("Stopping listener...")
		self.socket.close()
		printLine("Successfully stopped listener")
		self.socket = None
		self.status = "Stopped"


instance = Socket()
while True:
	if exit_:
		exit()
	if instance.socket is None or not ready:
		continue
	try:
		connection_, address_ = instance.socket.accept()
		printLine(f"Received connection from {address_[0]} at port {address_[1]}")
		_thread.start_new_thread(newConnection, (connection_, address_))
	except ConnectionAbortedError:
		continue
