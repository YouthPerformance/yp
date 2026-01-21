import SwiftUI

struct CaptureView: View {
    @State private var isRecording = false
    @State private var countdown: Int = 0
    @State private var showResult = false
    @State private var mockResult: Jump?

    var body: some View {
        NavigationStack {
            ZStack {
                // Camera preview placeholder
                cameraPreview

                // Guidance overlay
                if !isRecording {
                    guidanceOverlay
                }

                // Countdown
                if countdown > 0 {
                    countdownOverlay
                }

                // Controls
                VStack {
                    Spacer()
                    captureControls
                }
            }
            .navigationTitle("Capture Jump")
            .navigationBarTitleDisplayMode(.inline)
            .sheet(isPresented: $showResult) {
                if let result = mockResult {
                    ResultView(jump: result)
                }
            }
        }
    }

    // MARK: - Camera Preview
    private var cameraPreview: some View {
        ZStack {
            // Simulated camera background
            Rectangle()
                .fill(
                    LinearGradient(
                        colors: [Color.black.opacity(0.8), Color.black.opacity(0.6)],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .ignoresSafeArea()

            // Camera placeholder text
            VStack(spacing: 16) {
                Image(systemName: "camera.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.white.opacity(0.5))

                Text("Camera Preview")
                    .font(.title3)
                    .foregroundColor(.white.opacity(0.5))

                Text("240 FPS")
                    .font(.caption)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.green.opacity(0.3))
                    .foregroundColor(.green)
                    .cornerRadius(8)
            }
        }
    }

    // MARK: - Guidance Overlay
    private var guidanceOverlay: some View {
        VStack {
            // Top guidance
            HStack {
                guidanceChip(icon: "figure.stand", text: "Full body visible", isValid: true)
                Spacer()
                guidanceChip(icon: "sun.max.fill", text: "Good lighting", isValid: true)
            }
            .padding()

            Spacer()

            // Body frame guide
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.white.opacity(0.5), style: StrokeStyle(lineWidth: 2, dash: [10]))
                .frame(width: 200, height: 400)
                .overlay(
                    VStack {
                        Text("Position yourself")
                            .font(.caption)
                            .foregroundColor(.white)
                        Text("inside the frame")
                            .font(.caption)
                            .foregroundColor(.white)
                    }
                )

            Spacer()

            // Bottom tips
            HStack {
                Image(systemName: "info.circle")
                Text("Stand 6-10 feet from camera")
            }
            .font(.caption)
            .foregroundColor(.white.opacity(0.7))
            .padding()
        }
    }

    private func guidanceChip(icon: String, text: String, isValid: Bool) -> some View {
        HStack(spacing: 6) {
            Image(systemName: isValid ? "checkmark.circle.fill" : icon)
                .foregroundColor(isValid ? .green : .white)
            Text(text)
                .font(.caption)
                .foregroundColor(.white)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color.black.opacity(0.5))
        .cornerRadius(20)
    }

    // MARK: - Countdown
    private var countdownOverlay: some View {
        Text("\(countdown)")
            .font(.system(size: 120, weight: .bold, design: .rounded))
            .foregroundColor(.white)
            .shadow(radius: 10)
    }

    // MARK: - Capture Controls
    private var captureControls: some View {
        VStack(spacing: 20) {
            if isRecording {
                // Recording indicator
                HStack(spacing: 8) {
                    Circle()
                        .fill(Color.red)
                        .frame(width: 12, height: 12)
                    Text("Recording...")
                        .font(.headline)
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 10)
                .background(Color.black.opacity(0.7))
                .cornerRadius(25)
            }

            // Capture button
            Button(action: startCapture) {
                ZStack {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 80, height: 80)

                    Circle()
                        .fill(isRecording ? Color.red : Color.accentColor)
                        .frame(width: 70, height: 70)

                    if isRecording {
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color.white)
                            .frame(width: 30, height: 30)
                    } else {
                        Image(systemName: "figure.jumprope")
                            .font(.title)
                            .foregroundColor(.white)
                    }
                }
            }
            .disabled(countdown > 0)

            Text(isRecording ? "Tap to stop" : "Tap to start 3-second countdown")
                .font(.caption)
                .foregroundColor(.white.opacity(0.7))
        }
        .padding(.bottom, 40)
    }

    // MARK: - Actions
    private func startCapture() {
        if isRecording {
            stopRecording()
        } else {
            startCountdown()
        }
    }

    private func startCountdown() {
        countdown = 3

        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            if countdown > 1 {
                countdown -= 1
            } else {
                timer.invalidate()
                countdown = 0
                startRecording()
            }
        }
    }

    private func startRecording() {
        isRecording = true

        // Simulate 3-second recording
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            stopRecording()
        }
    }

    private func stopRecording() {
        isRecording = false

        // Show mock result
        mockResult = Jump(
            id: UUID().uuidString,
            userId: "user_123",
            heightInches: Double.random(in: 28...35),
            heightCm: Double.random(in: 71...89),
            confidence: .high,
            verificationTier: .silver,
            videoStorageId: "video_new",
            verificationPayload: nil,
            isPractice: false,
            status: .complete,
            gpsCity: "Houston",
            gpsState: "TX",
            gpsCountry: "US",
            createdAt: Date()
        )

        showResult = true
    }
}

#Preview {
    CaptureView()
}
