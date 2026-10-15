export class ApiError extends Error {
  public statusCode: number;
  public errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, errors?: any[]) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message: string = "Accès non autorisé") {
    return new ApiError(401, message);
  }

  static forbidden(message: string = "Droits insuffisants") {
    return new ApiError(403, message);
  }

  static notFound(message: string = "Ressource non trouvée") {
    return new ApiError(404, message);
  }

  static internal(message: string = "Erreur interne du serveur") {
    return new ApiError(500, message);
  }
}
