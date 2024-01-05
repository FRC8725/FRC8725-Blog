import re
from datetime import datetime

def tryInt(any):
    try: return int(any)
    except: return None

def RFC822(timeText, timeFormat = f'%Y/%m/%d', timezone = '+0000'):
    return datetime.strftime((datetime.strptime(timeText, timeFormat) if timeText != False else datetime.today()), f'%a, %d %b %Y %H:%M:%S %Z') + timezone

def magicTagReplace(content, replacementData, removeLineWhenMissingData = False):
	global missingMsg
	missingMsg = False
	newContent = []
	replacePattern = r'\<\?\=(.[^\>]*)\?\>'
	def lineProcess(line):
		global missingMsg
		if re.search(replacePattern, line):
			lineRemain = line
			data = {}
			while re.search(replacePattern, lineRemain):
				key = re.search(replacePattern, lineRemain, re.M|re.I)
				data[key.group(1)] = []
				lineRemain = lineRemain.replace(key.group(), '')
				keySegments = key.group(1).split('.')
				values = [replacementData]
				while len(keySegments) > 0:
					keySegment = keySegments.pop(0)
					if str(tryInt(keySegment)) == keySegment:
						values = [values[int(keySegment)]]
					else:
						if type(values[0]) == list:
							newValues = []
							for j in range(len(values)):
								newValues.extend(values[j])
							values = newValues
						for i in range(len(values)):
							values[i] = values[i].get(keySegment, None)
							if values[i] == None:
								if not missingMsg:
									missingMsg = True
									print('The corresponding value for the following key is missing!')
								print(key.group(1))
								if removeLineWhenMissingData: return
								else: values[i] = ''
								
				data[key.group(1)] = values
			for i in range(len(data[list(data.keys())[0]])):
				newLine = line
				for key in data:
					newLine = newLine.replace(f'<?={key}?>', str(data[key][i] if len(data[key]) > i else data[key][0]))
				newContent.append(newLine)
		else:
			newContent.append(line)
	for line in content.split('\n'):
		lineProcess(line)
	return '\n'.join(newContent)