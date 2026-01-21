package com.youthperformance.jump.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// YP Brand Colors
val YPOrange = Color(0xFFFF6B35)
val YPOrangeDark = Color(0xFFE55A2B)
val YPBlack = Color(0xFF1A1A1A)
val YPWhite = Color(0xFFFAFAFA)

// Verification Tier Colors
val BronzeColor = Color(0xFFCD7F32)
val SilverColor = Color(0xFFC0C0C0)
val GoldColor = Color(0xFFFFD700)
val PlatinumColor = Color(0xFF9B59B6)

private val DarkColorScheme = darkColorScheme(
    primary = YPOrange,
    onPrimary = Color.White,
    secondary = YPOrangeDark,
    tertiary = GoldColor,
    background = YPBlack,
    surface = Color(0xFF2A2A2A),
    onBackground = YPWhite,
    onSurface = YPWhite
)

private val LightColorScheme = lightColorScheme(
    primary = YPOrange,
    onPrimary = Color.White,
    secondary = YPOrangeDark,
    tertiary = GoldColor,
    background = YPWhite,
    surface = Color.White,
    onBackground = YPBlack,
    onSurface = YPBlack
)

@Composable
fun YPJumpTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
