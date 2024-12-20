// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "6.2.0"),
        .package(name: "CapacitorCommunityAppIcon", path: "../../../../app-icon"),
        .package(name: "CapacitorApp", path: "../../../node_modules/.pnpm/@capacitor+app@6.0.2_@capacitor+core@6.2.0/node_modules/@capacitor/app"),
        .package(name: "CapacitorFilesystem", path: "../../../node_modules/.pnpm/@capacitor+filesystem@6.0.2_@capacitor+core@6.2.0/node_modules/@capacitor/filesystem"),
        .package(name: "CapacitorHaptics", path: "../../../node_modules/.pnpm/@capacitor+haptics@6.0.2_patch_hash=isktf3ewuigcwl72katxy46idi_@capacitor+core@6.2.0/node_modules/@capacitor/haptics"),
        .package(name: "CapacitorKeyboard", path: "../../../node_modules/.pnpm/@capacitor+keyboard@6.0.3_patch_hash=2ihcxo2fu55l7b6g5u7feswwlm_@capacitor+core@6.2.0/node_modules/@capacitor/keyboard"),
        .package(name: "CapacitorNetwork", path: "../../../node_modules/.pnpm/@capacitor+network@6.0.3_@capacitor+core@6.2.0/node_modules/@capacitor/network"),
        .package(name: "CapacitorShare", path: "../../../node_modules/.pnpm/@capacitor+share@6.0.3_@capacitor+core@6.2.0/node_modules/@capacitor/share"),
        .package(name: "CapacitorSplashScreen", path: "../../../node_modules/.pnpm/@capacitor+splash-screen@6.0.3_@capacitor+core@6.2.0/node_modules/@capacitor/splash-screen"),
        .package(name: "CapacitorStatusBar", path: "../../../node_modules/.pnpm/@capacitor+status-bar@6.0.2_@capacitor+core@6.2.0/node_modules/@capacitor/status-bar"),
        .package(name: "CapacitorAndroidNavMode", path: "../../../../capacitor-android-nav-mode"),
        .package(name: "CapacitorApplicationContext", path: "../../../../capacitor-application-context"),
        .package(name: "CapacitorBiometricLock", path: "../../../../capacitor-biometric-lock"),
        .package(name: "CapacitorClearCache", path: "../../../../capacitor-clear-cache"),
        .package(name: "CapacitorLaunchNative", path: "../../../../capacitor-launch-native"),
        .package(name: "CapacitorPluginSafeArea", path: "../../../../capacitor-plugin-safe-area"),
        .package(name: "CapacitorReader", path: "../../../../capacitor-reader"),
        .package(name: "CapacitorStashMedia", path: "../../../../capacitor-stash-media"),
        .package(name: "CapacitorTips", path: "../../../../capacitor-tips")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorCommunityAppIcon", package: "CapacitorCommunityAppIcon"),
                .product(name: "CapacitorApp", package: "CapacitorApp"),
                .product(name: "CapacitorFilesystem", package: "CapacitorFilesystem"),
                .product(name: "CapacitorHaptics", package: "CapacitorHaptics"),
                .product(name: "CapacitorKeyboard", package: "CapacitorKeyboard"),
                .product(name: "CapacitorNetwork", package: "CapacitorNetwork"),
                .product(name: "CapacitorShare", package: "CapacitorShare"),
                .product(name: "CapacitorSplashScreen", package: "CapacitorSplashScreen"),
                .product(name: "CapacitorStatusBar", package: "CapacitorStatusBar"),
                .product(name: "CapacitorAndroidNavMode", package: "CapacitorAndroidNavMode"),
                .product(name: "CapacitorApplicationContext", package: "CapacitorApplicationContext"),
                .product(name: "CapacitorBiometricLock", package: "CapacitorBiometricLock"),
                .product(name: "CapacitorClearCache", package: "CapacitorClearCache"),
                .product(name: "CapacitorLaunchNative", package: "CapacitorLaunchNative"),
                .product(name: "CapacitorPluginSafeArea", package: "CapacitorPluginSafeArea"),
                .product(name: "CapacitorReader", package: "CapacitorReader"),
                .product(name: "CapacitorStashMedia", package: "CapacitorStashMedia"),
                .product(name: "CapacitorTips", package: "CapacitorTips")
            ]
        )
    ]
)
