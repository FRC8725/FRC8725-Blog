import os
import yaml
import basic

CUSTOM_DIR_PATH = 'custom'
DATA_DIR_PATH = 'data'

def tryInt(any):
    try: return int(any)
    except: return None

def process(customDirPath, dataDirPath):
    print('--html--')
    htmlContent = []

    templateFile = open(os.path.join(dataDirPath, 'template.html'), 'r', encoding='utf-8')
    templateContent = templateFile.read()
    templateFile.close()
    templateContent = templateContent.replace('<?=customDirPath?>', customDirPath)

    configFile = open(os.path.join(customDirPath, 'config.yml'), 'r', encoding='utf-8')
    configContent = configFile.read()
    configFile.close()
    configContent = yaml.safe_load(configContent)

    htmlContent = basic.magicTagReplace(templateContent, configContent, removeLineWhenMissingData=True)
        
    outputFile = open('index.html', 'w+', encoding='utf-8')
    outputFile.write(htmlContent)
    outputFile.close()

if __name__ == '__main__':
    if len(os.sys.argv) > 1:
        process(os.sys.argv[1], DATA_DIR_PATH)
    else:
        process(CUSTOM_DIR_PATH, DATA_DIR_PATH)