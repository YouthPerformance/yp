// ═══════════════════════════════════════════════════════════════
// xLENS CAPTURE VIEW
// Full capture flow with nonce overlay and IMU visualization
// ═══════════════════════════════════════════════════════════════

import SwiftUI

struct XLENSCaptureView: View {
    @StateObject private var coordinator = CaptureCoordinator()
    @Environment(\.dismiss) private var dismiss

    // Mock user ID - replace with actual auth
    let userId = "user_mock_123"

    var body: some View {
        NavigationStack {
            ZStack {
                // Camera preview
                cameraPreview

                // Nonce overlay (always visible when session active)
                if coordinator.sessionManager.hasValidSession {
                    nonceOverlay
                }

                // Guidance overlay
                if case .sessionReady = coordinator.captureState {
                    guidanceOverlay
                }

                // Countdown overlay
                if case .countdown(let count) = coordinator.captureState {
                    countdownOverlay(count)
                }

                // Recording indicator
                if case .recording = coordinator.captureState {
                    recordingOverlay
                }

                // Processing overlay
                if coordinator.isProcessing {
                    processingOverlay
                }

                // Controls
                VStack {
                    Spacer()
                    captureControls
                }
            }
            .navigationTitle("Capture Jump")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") {
                        coordinator.cancelCapture()
                        dismiss()
                    }
                }
            }
            .task {
                await coordinator.prepareCapture(userId: userId)
            }
            .onChange(of: coordinator.captureState) { _, newState in
                if case .complete(let result) = newState {
                    // Show result
                    print("Jump complete: \(result.heightInches) inches")
                }
            }
        }
    }

    // MARK: - Camera Preview

    private var cameraPreview: some View {
        ZStack {
            Rectangle()
                .fill(
                    LinearGradient(
                        colors: [Color.black.opacity(0.9), Color.black.opacity(0.7)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .ignoresSafeArea()

            VStack(spacing: 16) {
                Image(systemName: "camera.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.white.opacity(0.4))

                Text("Camera Preview")
                    .font(.title3)
                    .foregroundColor(.white.opacity(0.4))

                HStack(spacing: 12) {
                    statusChip(text: "240 FPS", color: .green)
                    statusChip(text: "IMU Active", color: coordinator.imuRecorder.isRecording ? .green : .gray)
                }
            }
        }
    }

    // MARK: - Nonce Overlay

    private var nonceOverlay: some View {
        VStack {
            HStack {
                // Nonce display - THE CHALLENGE
                VStack(alignment: .leading, spacing: 4) {
                    Text("VERIFICATION CODE")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.7))

                    Text(coordinator.sessionManager.nonceDisplay)
                        .font(.system(size: 28, weight: .bold, design: .monospaced))
                        .foregroundColor(.white)
                }
                .padding()
                .background(Color.black.opacity(0.7))
                .cornerRadius(12)

                Spacer()

                // Session timer
                VStack(alignment: .trailing, spacing: 4) {
                    Text("SESSION")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.7))

                    Text(coordinator.sessionManager.timeRemainingFormatted)
                        .font(.system(size: 20, weight: .semibold, design: .monospaced))
                        .foregroundColor(timerColor)
                }
                .padding()
                .background(Color.black.opacity(0.7))
                .cornerRadius(12)
            }
            .padding()

            Spacer()
        }
    }

    private var timerColor: Color {
        let remaining = coordinator.sessionManager.timeRemaining
        if remaining > 60 { return .green }
        if remaining > 30 { return .yellow }
        return .red
    }

    // MARK: - Guidance Overlay

    private var guidanceOverlay: some View {
        VStack {
            Spacer()

            // Body frame guide
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.white.opacity(0.5), style: StrokeStyle(lineWidth: 2, dash: [10]))
                .frame(width: 200, height: 380)
                .overlay(
                    VStack(spacing: 8) {
                        Image(systemName: "figure.stand")
                            .font(.system(size: 40))
                            .foregroundColor(.white.opacity(0.5))
                        Text("Position yourself")
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.7))
                        Text("inside the frame")
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.7))
                    }
                )

            Spacer()

            // Tips
            VStack(spacing: 8) {
                guidanceTip(icon: "figure.stand", text: "Full body visible in frame")
                guidanceTip(icon: "sun.max", text: "Good lighting")
                guidanceTip(icon: "ruler", text: "6-10 feet from camera")
            }
            .padding(.bottom, 120)
        }
    }

    private func guidanceTip(icon: String, text: String) -> some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .foregroundColor(.white.opacity(0.7))
            Text(text)
                .font(.caption)
                .foregroundColor(.white.opacity(0.7))
        }
    }

    // MARK: - Countdown Overlay

    private func countdownOverlay(_ count: Int) -> some View {
        ZStack {
            Color.black.opacity(0.5)
                .ignoresSafeArea()

            VStack(spacing: 20) {
                Text("\(count)")
                    .font(.system(size: 140, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .shadow(radius: 20)

                Text("Get ready to jump!")
                    .font(.title3)
                    .foregroundColor(.white.opacity(0.8))
            }
        }
    }

    // MARK: - Recording Overlay

    private var recordingOverlay: some View {
        VStack {
            Spacer()

            // IMU visualization
            HStack(spacing: 20) {
                // Acceleration meter
                VStack(spacing: 4) {
                    Text("G-FORCE")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.7))

                    Text(String(format: "%.1f", coordinator.imuRecorder.currentAcceleration))
                        .font(.system(size: 36, weight: .bold, design: .monospaced))
                        .foregroundColor(gForceColor)

                    Text("G")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.7))
                }
                .frame(width: 100)
                .padding()
                .background(Color.black.opacity(0.7))
                .cornerRadius(12)

                // Sample counter
                VStack(spacing: 4) {
                    Text("SAMPLES")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.7))

                    Text("\(coordinator.imuRecorder.sampleCount)")
                        .font(.system(size: 24, weight: .bold, design: .monospaced))
                        .foregroundColor(.green)
                }
                .frame(width: 100)
                .padding()
                .background(Color.black.opacity(0.7))
                .cornerRadius(12)
            }

            Spacer()

            // Recording indicator
            HStack(spacing: 8) {
                Circle()
                    .fill(Color.red)
                    .frame(width: 12, height: 12)
                    .opacity(pulsingOpacity)

                Text("Recording")
                    .font(.headline)
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 12)
            .background(Color.black.opacity(0.7))
            .cornerRadius(25)

            Spacer()
                .frame(height: 150)
        }
    }

    private var gForceColor: Color {
        let g = coordinator.imuRecorder.currentAcceleration
        if g < 0.3 { return .cyan } // Freefall
        if g > 2.0 { return .orange } // Impact
        return .white
    }

    @State private var pulsingOpacity: Double = 1.0

    // MARK: - Processing Overlay

    private var processingOverlay: some View {
        ZStack {
            Color.black.opacity(0.8)
                .ignoresSafeArea()

            VStack(spacing: 24) {
                ProgressView()
                    .scaleEffect(1.5)
                    .tint(.white)

                Text(coordinator.stateDescription)
                    .font(.headline)
                    .foregroundColor(.white)

                if case .uploading = coordinator.captureState {
                    ProgressView(value: coordinator.uploadProgress)
                        .frame(width: 200)
                        .tint(.green)
                }

                if case .processing = coordinator.captureState {
                    ProgressView(value: coordinator.processingProgress)
                        .frame(width: 200)
                        .tint(.blue)
                }
            }
        }
    }

    // MARK: - Capture Controls

    private var captureControls: some View {
        VStack(spacing: 20) {
            // Main capture button
            Button(action: handleCaptureButton) {
                ZStack {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 80, height: 80)

                    Circle()
                        .fill(buttonColor)
                        .frame(width: 70, height: 70)

                    buttonIcon
                }
            }
            .disabled(!canPressButton)
            .opacity(canPressButton ? 1 : 0.5)

            Text(buttonHint)
                .font(.caption)
                .foregroundColor(.white.opacity(0.7))
        }
        .padding(.bottom, 40)
    }

    private var buttonColor: Color {
        switch coordinator.captureState {
        case .recording: return .red
        case .sessionReady: return .accentColor
        default: return .gray
        }
    }

    private var buttonIcon: some View {
        Group {
            switch coordinator.captureState {
            case .recording:
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.white)
                    .frame(width: 30, height: 30)
            case .sessionReady:
                Image(systemName: "figure.jumprope")
                    .font(.title)
                    .foregroundColor(.white)
            default:
                ProgressView()
                    .tint(.white)
            }
        }
    }

    private var buttonHint: String {
        switch coordinator.captureState {
        case .idle, .preparingSession: return "Preparing..."
        case .sessionReady: return "Tap to start countdown"
        case .countdown: return "Get ready!"
        case .recording: return "Tap to stop"
        default: return ""
        }
    }

    private var canPressButton: Bool {
        switch coordinator.captureState {
        case .sessionReady, .recording: return true
        default: return false
        }
    }

    private func handleCaptureButton() {
        switch coordinator.captureState {
        case .sessionReady:
            coordinator.startCountdown()
        case .recording:
            Task {
                await coordinator.stopRecording()
            }
        default:
            break
        }
    }

    // MARK: - Helpers

    private func statusChip(text: String, color: Color) -> some View {
        Text(text)
            .font(.caption)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(color.opacity(0.3))
            .foregroundColor(color)
            .cornerRadius(8)
    }
}

#Preview {
    XLENSCaptureView()
}
