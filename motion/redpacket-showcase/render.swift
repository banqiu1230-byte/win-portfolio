import AppKit
import AVFoundation
import CoreVideo
import ImageIO

let width = 1080
let height = 1080
let fps: Int32 = 30
let duration = 19.5

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let assetDirectory = root.appendingPathComponent("motion/redpacket-showcase/assets")
let outputURL = root.appendingPathComponent("motion/redpacket-showcase/output/redpacket-showcase-v1.mp4")

let assetFiles = [
    "01-feed.png",
    "02-result.png",
    "03-sold-out.png",
    "04-chat.png",
    "05-video.png"
]

func loadImage(_ name: String) -> CGImage {
    let url = assetDirectory.appendingPathComponent(name) as CFURL
    guard let source = CGImageSourceCreateWithURL(url, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        fatalError("Unable to load asset: \(name)")
    }
    return image
}

let images = assetFiles.map(loadImage)

func clamp(_ value: CGFloat, _ lower: CGFloat = 0, _ upper: CGFloat = 1) -> CGFloat {
    min(max(value, lower), upper)
}

func mix(_ a: CGFloat, _ b: CGFloat, _ progress: CGFloat) -> CGFloat {
    a + (b - a) * progress
}

func easeInOut(_ value: CGFloat) -> CGFloat {
    let x = clamp(value)
    return x * x * (3 - 2 * x)
}

func easeOut(_ value: CGFloat) -> CGFloat {
    let x = clamp(value)
    return 1 - pow(1 - x, 3)
}

func progress(_ time: CGFloat, from start: CGFloat, to end: CGFloat) -> CGFloat {
    clamp((time - start) / (end - start))
}

func color(_ hex: UInt32, alpha: CGFloat = 1) -> CGColor {
    CGColor(
        red: CGFloat((hex >> 16) & 0xff) / 255,
        green: CGFloat((hex >> 8) & 0xff) / 255,
        blue: CGFloat(hex & 0xff) / 255,
        alpha: alpha
    )
}

func fill(_ context: CGContext, rect: CGRect, hex: UInt32, alpha: CGFloat = 1) {
    context.setFillColor(color(hex, alpha: alpha))
    context.fill(rect)
}

func roundedPath(_ rect: CGRect, radius: CGFloat) -> CGPath {
    CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil)
}

func drawImage(
    _ image: CGImage,
    in rect: CGRect,
    context: CGContext,
    radius: CGFloat,
    zoom: CGFloat = 1,
    focalX: CGFloat = 0.5,
    focalY: CGFloat = 0.5,
    rotation: CGFloat = 0,
    alpha: CGFloat = 1,
    shadow: CGFloat = 30,
    trailX: CGFloat = 0,
    trailY: CGFloat = 0,
    trailAlpha: CGFloat = 0
) {
    guard alpha > 0.001 else { return }

    context.saveGState()
    context.translateBy(x: rect.midX, y: rect.midY)
    context.rotate(by: rotation)
    let localRect = CGRect(x: -rect.width / 2, y: -rect.height / 2, width: rect.width, height: rect.height)

    context.setShadow(offset: CGSize(width: 0, height: 18), blur: shadow, color: color(0x34251f, alpha: 0.18 * alpha))
    context.setFillColor(color(0xffffff, alpha: alpha))
    context.addPath(roundedPath(localRect, radius: radius))
    context.fillPath()
    context.setShadow(offset: .zero, blur: 0, color: nil)

    context.addPath(roundedPath(localRect, radius: radius))
    context.clip()

    let imageWidth = CGFloat(image.width)
    let imageHeight = CGFloat(image.height)
    let baseScale = max(localRect.width / imageWidth, localRect.height / imageHeight) * zoom
    let drawWidth = imageWidth * baseScale
    let drawHeight = imageHeight * baseScale

    var drawX = -drawWidth * focalX
    var drawY = -drawHeight * focalY
    drawX = min(max(drawX, localRect.maxX - drawWidth), localRect.minX)
    drawY = min(max(drawY, localRect.maxY - drawHeight), localRect.minY)
    let imageRect = CGRect(x: drawX, y: drawY, width: drawWidth, height: drawHeight)

    if trailAlpha > 0.001 {
        for index in stride(from: 4, through: 1, by: -1) {
            context.setAlpha(alpha * trailAlpha * CGFloat(index) / 18)
            context.draw(image, in: imageRect.offsetBy(dx: trailX * CGFloat(index), dy: trailY * CGFloat(index)))
        }
    }

    context.setAlpha(alpha)
    context.draw(image, in: imageRect)
    context.restoreGState()
}

func drawComposition(at time: CGFloat, in context: CGContext) {
    let canvas = CGRect(x: 0, y: 0, width: width, height: height)
    fill(context, rect: canvas, hex: 0xf4f1ed)

    if time < 1.45 {
        let p = easeOut(progress(time, from: 0, to: 1.45))
        fill(context, rect: canvas, hex: 0xff443d, alpha: mix(1, 0.12, p))
        let side = mix(1460, 660, p)
        let rect = CGRect(x: (CGFloat(width) - side) / 2, y: (CGFloat(height) - side * 1.6) / 2, width: side, height: side * 1.6)
        drawImage(
            images[1],
            in: rect,
            context: context,
            radius: mix(0, 42, p),
            zoom: mix(1.55, 1.05, p),
            focalY: mix(0.27, 0.31, p),
            rotation: mix(-0.12, -0.025, p),
            alpha: p,
            shadow: 44,
            trailX: -12,
            trailY: 5,
            trailAlpha: 1 - p
        )
        return
    }

    if time < 3.8 {
        let p = easeInOut(progress(time, from: 1.45, to: 3.8))
        let rect = CGRect(x: mix(287, 305, p), y: mix(88, 60, p), width: mix(506, 470, p), height: mix(904, 960, p))
        drawImage(images[0], in: rect, context: context, radius: 38, zoom: mix(1.02, 1.08, p), focalY: mix(0.48, 0.42, p), rotation: mix(-0.025, 0.012, p), shadow: 40)
        return
    }

    if time < 6.5 {
        let p = easeInOut(progress(time, from: 3.8, to: 6.5))
        let rect = CGRect(x: mix(305, 90, p), y: mix(60, -130, p), width: mix(470, 900, p), height: mix(960, 1380, p))
        drawImage(images[0], in: rect, context: context, radius: mix(38, 50, p), zoom: mix(1.08, 1.32, p), focalY: mix(0.42, 0.34, p), rotation: mix(0.012, -0.018, p), shadow: 42)
        return
    }

    if time < 8.25 {
        let p = easeInOut(progress(time, from: 6.5, to: 8.25))
        let rect = CGRect(x: mix(90, 235, p), y: mix(-130, 34, p), width: mix(900, 610, p), height: mix(1380, 1012, p))
        drawImage(images[0], in: rect, context: context, radius: 46, zoom: mix(1.32, 1.05, p), focalY: mix(0.34, 0.34, p), rotation: mix(-0.018, -0.04, p), alpha: 1 - p, shadow: 44, trailX: -8, trailY: 0, trailAlpha: p)
        drawImage(images[1], in: rect, context: context, radius: 46, zoom: mix(1.18, 1.05, p), focalY: 0.31, rotation: mix(0.035, 0, p), alpha: p, shadow: 44, trailX: 8, trailY: 0, trailAlpha: 1 - p)
        return
    }

    if time < 10.85 {
        let p = easeInOut(progress(time, from: 8.25, to: 10.85))
        let rect = CGRect(x: mix(235, 72, p), y: mix(34, -170, p), width: mix(610, 936, p), height: mix(1012, 1460, p))
        drawImage(images[1], in: rect, context: context, radius: mix(46, 56, p), zoom: mix(1.05, 1.3, p), focalY: mix(0.31, 0.33, p), rotation: mix(0, 0.014, p), shadow: 44)
        return
    }

    if time < 12.25 {
        let p = easeInOut(progress(time, from: 10.85, to: 12.25))
        let rect = CGRect(x: mix(72, 235, p), y: mix(-170, 34, p), width: mix(936, 610, p), height: mix(1460, 1012, p))
        drawImage(images[1], in: rect, context: context, radius: 46, zoom: mix(1.3, 1.05, p), focalY: 0.33, rotation: mix(0.014, -0.018, p), alpha: 1 - p, shadow: 44)
        drawImage(images[2], in: rect, context: context, radius: 46, zoom: 1.05, focalY: 0.31, rotation: mix(0.026, 0, p), alpha: p, shadow: 44)
        return
    }

    if time < 13.45 {
        let p = easeInOut(progress(time, from: 12.25, to: 13.45))
        let rect = CGRect(x: 235, y: 34, width: 610, height: 1012)
        drawImage(images[2], in: rect, context: context, radius: 46, zoom: 1.05, focalY: 0.31, rotation: mix(0, -0.05, p), alpha: 1 - p, shadow: 44, trailX: -18, trailY: 0, trailAlpha: p)
        fill(context, rect: CGRect(x: mix(-420, 0, p), y: 0, width: 380, height: 1080), hex: 0xff443d)
        fill(context, rect: CGRect(x: mix(1080, 390, p), y: 0, width: 300, height: 1080), hex: 0xffffff)
        fill(context, rect: CGRect(x: mix(1380, 730, p), y: 0, width: 420, height: 1080), hex: 0xffd5cc)
        return
    }

    if time < 16.75 {
        let p = easeOut(progress(time, from: 13.45, to: 16.75))
        fill(context, rect: canvas, hex: 0xff443d, alpha: mix(0.16, 0.04, p))
        let rect = CGRect(x: mix(1020, 204, p), y: mix(34, 12, p), width: 672, height: 1056)
        drawImage(images[3], in: rect, context: context, radius: 52, zoom: mix(1.15, 1.04, p), focalY: 0.48, rotation: mix(0.09, -0.012, p), shadow: 48, trailX: 18, trailY: 0, trailAlpha: 1 - p)
        return
    }

    let p = easeInOut(progress(time, from: 16.75, to: 19.5))
    fill(context, rect: canvas, hex: 0xff443d, alpha: mix(0.04, 0.12, p))
    let rect = CGRect(x: mix(204, 102, p), y: mix(12, -92, p), width: mix(672, 876, p), height: mix(1056, 1264, p))
    drawImage(images[3], in: rect, context: context, radius: 52, zoom: mix(1.04, 1.18, p), focalY: 0.48, rotation: mix(-0.012, -0.035, p), alpha: 1 - p, shadow: 48)
    drawImage(images[4], in: rect, context: context, radius: 52, zoom: mix(1.02, 1.16, p), focalY: mix(0.42, 0.38, p), rotation: mix(0.025, 0, p), alpha: p, shadow: 48)
    fill(context, rect: canvas, hex: 0xf4f1ed, alpha: easeInOut(progress(time, from: 19.1, to: 19.5)))
}

try? FileManager.default.removeItem(at: outputURL)
let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 12_000_000,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel
    ]
]

let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(
    assetWriterInput: input,
    sourcePixelBufferAttributes: [
        kCVPixelBufferPixelFormatTypeKey as String: Int(kCVPixelFormatType_32BGRA),
        kCVPixelBufferWidthKey as String: width,
        kCVPixelBufferHeightKey as String: height,
        kCVPixelBufferIOSurfacePropertiesKey as String: [:]
    ]
)

guard writer.canAdd(input) else { fatalError("Unable to add writer input") }
writer.add(input)
writer.startWriting()
writer.startSession(atSourceTime: .zero)

guard let pool = adaptor.pixelBufferPool else { fatalError("Unable to create pixel buffer pool") }
let frameCount = Int(duration * Double(fps))
let colorSpace = CGColorSpaceCreateDeviceRGB()

for frameIndex in 0..<frameCount {
    autoreleasepool {
        while !input.isReadyForMoreMediaData {
            Thread.sleep(forTimeInterval: 0.002)
        }

        var optionalBuffer: CVPixelBuffer?
        CVPixelBufferPoolCreatePixelBuffer(nil, pool, &optionalBuffer)
        guard let buffer = optionalBuffer else { fatalError("Unable to allocate pixel buffer") }
        CVPixelBufferLockBaseAddress(buffer, [])
        guard let baseAddress = CVPixelBufferGetBaseAddress(buffer),
              let context = CGContext(
                data: baseAddress,
                width: width,
                height: height,
                bitsPerComponent: 8,
                bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
                space: colorSpace,
                bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue
              ) else {
            fatalError("Unable to create drawing context")
        }

        drawComposition(at: CGFloat(frameIndex) / CGFloat(fps), in: context)
        CVPixelBufferUnlockBaseAddress(buffer, [])

        let presentationTime = CMTime(value: CMTimeValue(frameIndex), timescale: fps)
        if !adaptor.append(buffer, withPresentationTime: presentationTime) {
            fatalError("Unable to append frame \(frameIndex): \(writer.error?.localizedDescription ?? "unknown error")")
        }

        if frameIndex % 60 == 0 {
            print("Rendered \(frameIndex)/\(frameCount)")
        }
    }
}

input.markAsFinished()
let semaphore = DispatchSemaphore(value: 0)
writer.finishWriting {
    semaphore.signal()
}
semaphore.wait()

guard writer.status == .completed else {
    fatalError("Video export failed: \(writer.error?.localizedDescription ?? "unknown error")")
}

print("Exported \(outputURL.path)")
