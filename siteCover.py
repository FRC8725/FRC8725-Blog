import os
import yaml
import cv2
import numpy as np
import PIL.Image, PIL.ImageDraw, PIL.ImageFont

# 之所以沒有使用cv2的mask操作，是因為想嘗試使用numpy刻刻看

# basic method
def functionFilledArray(size:np.array, function):
    return np.array([[function(np.array([h, w])) for w in range(size[1])] for h in range(size[0])])
def mixWithMask(img1:np.array, img2:np.array, img2_mask:np.array or int or float):
    return (
        img1 * (1 - img2_mask)
        + 
        img2 * (img2_mask)
    )
def getTextImage(text, size, fontPath):
    font = PIL.ImageFont.truetype(fontPath, size)
    w, h = font.getsize(text)
    textImg = PIL.Image.new(mode='RGB', size=(w+2, h+2), color=(0, 0, 0))
    PIL.ImageDraw.Draw(textImg).text(
        (1, 1), 
        text, 
        font=font, 
        fill=(255, 255, 255)
    )
    # print(textImg)
    # exit()
    return np.array(textImg)

def floorInt(f):
    return np.floor(f).astype(int)

CUSTOM_DIR_PATH = 'custom'
DATA_DIR_PATH = 'data'

def process(customDirPath, dataDirPath):
    print('--siteCover--')

    configFile = open(os.path.join(customDirPath, 'config.yml'), 'r', encoding='utf-8')
    configContent = configFile.read()
    configFile.close()
    configContent = yaml.safe_load(configContent)

    # declare colors
    class color:
        background = (61, 61, 61, 1)
        dot = (255, 255, 255, 1)
        header = (0, 0, 0, 0.53)
        title = (255, 255, 255, 1)
        description = (255, 255, 255, 0.8)

    # create image
    imgSizeRate = 0.8
    imgSize = np.array([720, 1080]).astype(int)
    def position(size:np.array):
        return (imgSize * size).astype(int)
    img = np.zeros([*imgSize, 3], dtype=np.uint8)

    # fill background
    [*img[:, :, :]] = [*color.background[0:3]]

    # draw background decorate (dots and lines)
    dotAmount = 100
    maxLineLength = 80
    dotXs = np.random.randint(imgSize[1], size=dotAmount)
    dotYs = np.random.randint(imgSize[0], size=dotAmount)
    for i in range(dotAmount):
        d1 = np.array([dotYs[i], dotXs[i]])
        [*img[dotYs[i], dotXs[i]]] = [*color.dot[0:3]]
        for j in range(i+1, dotAmount):
            d2 = np.array([dotYs[j], dotXs[j]])
            distance = np.linalg.norm(d2 - d1)
            # distance = np.absolute(d2[0] - d1[0]) + np.absolute(d2[1] - d1[1])
            if distance < maxLineLength:
                lineOpacity = (1 - distance/maxLineLength)
                cv2.line(img, d1, d2, np.array(color.background)*(1-lineOpacity) + np.array(color.dot)*lineOpacity, 1)

    # header mask
    avatarSize = floorInt(imgSize[0]*0.3)
    avatarMargin = floorInt(imgSize[0]*0.05)
    avatarPosition = position(np.array([0.35, 0.5]))
    headerMaskHeight = floorInt(imgSize[0]*0.7)
    headerMaskShape_mask = functionFilledArray(imgSize, lambda pos: ([1, 1, 1] if np.linalg.norm(pos - avatarPosition) > (avatarSize/2 + avatarMargin) else [0, 0, 0]) if pos[0] > imgSize[0] - headerMaskHeight else [0, 0, 0])
    [*img[:, :]] = [*mixWithMask(
        img[:, :], 
        mixWithMask(
            img[:, :], 
            np.array(color.header[0:3]), 
            color.header[3]
        ),
        cv2.blur(headerMaskShape_mask*255, (4, 4))/255
    )]

    # draw avatar
    avatar = cv2.imread(os.path.join(customDirPath, configContent['avatarPath']))
    avatar = cv2.resize(avatar, (avatarSize, avatarSize), interpolation=cv2.INTER_AREA)
    relativeAvatarPosition =  np.array([avatarSize, avatarSize])*0.5
    avatar_mask = functionFilledArray(np.array([avatarSize, avatarSize]), lambda pos: [1, 1, 1] if np.linalg.norm(pos - relativeAvatarPosition) < (avatarSize/2) else [0, 0, 0])
    sY = floorInt(avatarPosition[0] - avatarSize/2)
    sX = floorInt(avatarPosition[1] - avatarSize/2)
    [*img[sY : sY+avatarSize, sX : sX+avatarSize]] = [*mixWithMask(
        img[sY : sY+avatarSize, sX : sX+avatarSize], 
        avatar, 
        avatar_mask
    )]

    #draw texts
    def drawText(textPosition, textContent, fontSize, lightness, yAlign='center', xAlign='center'):
        text = None
        textLength = len(textContent)
        while not (type(text) == np.ndarray and (text.shape[1] < imgSize[1].astype(int) or textLength == 0)):
            text = getTextImage(textContent[:textLength], fontSize, 'public/font/GenJyuuGothic-Bold.ttf')
            textLength -= 1
        sY = floorInt(textPosition[0] - text.shape[0]/2)
        sX = floorInt(textPosition[1] - text.shape[1]/2)
        [*img[sY : sY+text.shape[0], sX : sX+text.shape[1]]] = [*mixWithMask(
            img[sY : sY+text.shape[0], sX : sX+text.shape[1]], 
            text*lightness, 
            cv2.blur(text, (4, 4))/255
        )]
    drawText(position(np.array([0.65, 0.5])), configContent['title'], floorInt(imgSize[0]*0.1), color.title[3])
    drawText(position(np.array([0.77, 0.5])), configContent['description'], floorInt(imgSize[0]*0.06), color.description[3])

    # show image
    # cv2.imshow('img', img)
    # cv2.waitKey(-1)
    cv2.imwrite(os.path.join(dataDirPath, 'siteCover.jpg'), img)

if __name__ == '__main__':
    if len(os.sys.argv) > 1:
        process(os.sys.argv[1], DATA_DIR_PATH)
    else:
        process(CUSTOM_DIR_PATH, DATA_DIR_PATH)