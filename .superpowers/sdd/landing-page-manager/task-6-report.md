# Task 6: POST /api/landing-pages/publish API Route - Completion Report

## Summary

Task 6 has been completed successfully. The POST /api/landing-pages/publish endpoint has been fully implemented with Lighthouse score gating and comprehensive test coverage.

## Files Created/Modified

### 1. `/app/api/landing-pages/publish/route.ts` (NEW)
- **Purpose**: Route handler for publishing landing pages
- **Key Features**:
  - Authentication check using `requireAuth()` - returns 401 if unauthorized
  - Request body parsing to extract landing page id
  - Landing page lookup via Prisma - returns 404 if not found
  - Lighthouse score validation with detailed error messages:
    - Returns 400 if `lighthouseScore === null` with message: "Lighthouse check not run. Please check Lighthouse score first."
    - Returns 400 if `lighthouseScore < 90` with message: "Lighthouse score is {score}. Must be 90 or higher to publish."
  - Status update to "published" in database
  - Returns 200 with complete response: { id, status, lighthouseScore, subdomain }
  - Comprehensive error handling with 401, 400, 404, and 500 status codes

### 2. `/tests/api/landing-pages/publish.test.ts` (NEW)
- **Purpose**: Comprehensive test suite for the publish endpoint
- **Test Cases**:
  - ✅ Publishes page if Lighthouse score >= 90 (200 response with published status)
  - ✅ Returns 400 if Lighthouse score not checked (null value)
  - ✅ Returns 400 if Lighthouse score < 90 (below minimum threshold)
  - ✅ Returns 404 if landing page not found (invalid id)
- **Auth Handling**: Mocks `requireAuth()` to allow tests to run without JWT tokens
- **Test Setup**: Creates test landing pages with different Lighthouse score scenarios

## Test Results

All tests pass successfully:
```
Test Suites: 1 passed
Tests:       4 passed, 4 total
Time:        4.546s
```

## Implementation Details

### Validation Pipeline
1. **Auth**: `requireAuth()` throws if no valid JWT token
2. **Landing Page Lookup**: Database query by id - returns 404 if not found
3. **Lighthouse Score Check**:
   - Null check: Lighthouse audit must have been run (Task 5)
   - Score validation: Must be >= 90 to publish (quality gate)
4. **Status Update**: Set status to "published" in database

### Response Format (200 OK)
```json
{
  "id": 1,
  "status": "published",
  "lighthouseScore": 95,
  "subdomain": "summer-promo.quindart.com"
}
```

### Error Responses
- **401 Unauthorized**: No valid authentication token
- **400 Bad Request**: 
  - Lighthouse check not run (null score)
  - Lighthouse score below 90 threshold
- **404 Not Found**: Landing page with given id does not exist
- **500 Internal Server Error**: Unexpected server errors

## Constant Used

```typescript
const DOMAIN = 'quindart.com'
```

Subdomain is constructed as: `${landingPage.slug}.${DOMAIN}`

## Workflow Integration

This endpoint is part of the landing page management workflow:
1. Task 4: Create landing page (draft status, null Lighthouse score)
2. Task 5: Check Lighthouse score (updates score, may fail if < 90)
3. Task 6: Publish landing page (requires score >= 90, sets status to published)

The Lighthouse score serves as a quality gate to ensure published pages meet performance standards.

## Git Commit

```
commit 69d52f6
feat(api): implement POST /api/landing-pages/publish endpoint with Lighthouse gating
```

## Status

✅ **COMPLETE** - All requirements met
- Route handler implemented with proper validation pipeline
- Lighthouse score gating enforced (quality gate)
- Test suite created and all 4 tests passing
- Database integration working correctly
- Error handling comprehensive with specific error messages
- Code follows project patterns and conventions (matches check-lighthouse and create route patterns)
- Subdomain construction with constant DOMAIN value
