# Bedrock-All-Models-Test.ps1

$Token = $env:AWS_BEARER_TOKEN_BEDROCK
$Region = "us-east-1"

if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Error "AWS_BEARER_TOKEN_BEDROCK not set"
    exit 1
}

$Headers = @{
    Authorization = "Bearer $Token"
    "Content-Type" = "application/json"
}

function Get-TestPayload {
    param([string]$ModelId)

    switch -Regex ($ModelId) {

        "^anthropic\." {
            return @{
                anthropic_version = "bedrock-2023-05-31"
                max_tokens = 10
                messages = @(
                    @{
                        role = "user"
                        content = "hello"
                    }
                )
            } | ConvertTo-Json -Depth 10
        }

        "^meta\." {
            return @{
                prompt = "hello"
                max_gen_len = 10
                temperature = 0
            } | ConvertTo-Json
        }

        "^amazon\.nova" {
            return @{
                messages = @(
                    @{
                        role = "user"
                        content = @(
                            @{
                                text = "hello"
                            }
                        )
                    }
                )
                inferenceConfig = @{
                    maxTokens = 10
                }
            } | ConvertTo-Json -Depth 10
        }

        "^mistral\." {
            return @{
                prompt = "hello"
                max_tokens = 10
            } | ConvertTo-Json
        }

        "^cohere\." {
            return @{
                prompt = "hello"
                max_tokens = 10
            } | ConvertTo-Json
        }

        "^ai21\." {
            return @{
                prompt = "hello"
                maxTokens = 10
            } | ConvertTo-Json
        }

        default {
            return @{
                prompt = "hello"
                max_tokens = 10
            } | ConvertTo-Json
        }
    }
}

Write-Host "Fetching models..."

$Models = Invoke-RestMethod `
    -Uri "https://bedrock.$Region.amazonaws.com/foundation-models" `
    -Headers $Headers `
    -Method GET

$Results = @()

foreach ($Model in $Models.modelSummaries) {

    $ModelId = $Model.modelId

    Write-Host "`nTesting $ModelId"

    $Payload = Get-TestPayload $ModelId

    try {

        $Response = Invoke-WebRequest `
            -Uri "https://bedrock-runtime.$Region.amazonaws.com/model/$([uri]::EscapeDataString($ModelId))/invoke" `
            -Method POST `
            -Headers $Headers `
            -Body $Payload

        $Results += [PSCustomObject]@{
            Model = $ModelId
            Result = "WORKING"
            HttpCode = $Response.StatusCode
            Detail = ""
        }

        Write-Host "WORKING"

    } catch {

        $Code = ""
        $Body = ""

        try {
            $Code = $_.Exception.Response.StatusCode.value__

            $Reader = New-Object IO.StreamReader(
                $_.Exception.Response.GetResponseStream()
            )

            $Body = $Reader.ReadToEnd()
        } catch {}

        $Status = switch ($Code) {
            400 { "BAD_PAYLOAD" }
            401 { "UNAUTHORIZED" }
            403 { "ACCESS_DENIED" }
            404 { "NOT_FOUND" }
            429 { "THROTTLED" }
            default { "ERROR" }
        }

        Write-Host "$Status ($Code)"

        $Results += [PSCustomObject]@{
            Model = $ModelId
            Result = $Status
            HttpCode = $Code
            Detail = $Body
        }
    }

    Start-Sleep -Milliseconds 300
}

$Results | Export-Csv `
    ".\bedrock-full-report.csv" `
    -NoTypeInformation

Write-Host "`nSaved report -> bedrock-full-report.csv"